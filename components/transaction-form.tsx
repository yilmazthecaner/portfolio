"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ArrowRightLeft, AlertCircle, Info } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { useTranslation } from "@/context/translation-context";
import { useSettings } from "@/context/settings-context";
import type { Transaction, TransactionFormData } from "@/types/transaction";
import { TransactionConfirmation } from "@/components/transaction-confirmation";
import { useUser } from "@/context/user-context";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Create a more robust schema with custom validation
const formSchema = z.object({
  type: z.enum(["buy", "sell", "transfer"]),
  asset: z.string().min(1, {
    message: "Please select an asset.",
  }),
  amount: z.coerce
    .number()
    .positive({
      message: "Amount must be a positive number.",
    })
    .refine((val) => !isNaN(val), {
      message: "Please enter a valid number.",
    })
    .refine((val) => val <= 1000000, {
      message: "Amount cannot exceed 1,000,000.",
    }),
  price: z.coerce
    .number()
    .positive({
      message: "Price must be a positive number.",
    })
    .refine((val) => !isNaN(val), {
      message: "Please enter a valid number.",
    }),
  transferDirection: z.enum(["send", "receive"]).optional(),
});

const assets = [
  { id: "AAPL", name: "Apple Inc.", icon: "🍎" },
  { id: "MSFT", name: "Microsoft Corporation", icon: "💻" },
  { id: "GOOGL", name: "Alphabet Inc.", icon: "🔍" },
  { id: "AMZN", name: "Amazon.com, Inc.", icon: "📦" },
  { id: "TSLA", name: "Tesla, Inc.", icon: "🚗" },
  { id: "NVDA", name: "NVIDIA Corporation", icon: "🎮" },
  { id: "META", name: "Meta Platforms, Inc.", icon: "👓" },
];

const transferAssets = [
  { id: "USD", name: "USD Dollar", icon: "$" },
  { id: "TRY", name: "Turkish Lira", icon: "₺" },
  { id: "EUR", name: "Euro", icon: "€" },
];

export function TransactionForm({
  onTransactionComplete,
}: {
  onTransactionComplete?: () => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completedTransaction, setCompletedTransaction] =
    useState<Transaction | null>(null);
  const [insufficientFunds, setInsufficientFunds] = useState(false);
  const { t } = useTranslation();
  const { hideBalance } = useSettings();
  const { processTransaction, user } = useUser();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "buy",
      asset: "",
      amount: 0,
      price: 0,
      transferDirection: "send",
    },
  });

  const watchedType = form.watch("type");
  const watchedAmount = form.watch("amount");
  const watchedPrice = form.watch("price");
  const watchedTransferDirection = form.watch("transferDirection");
  const totalValue =
    watchedAmount * (watchedType === "transfer" ? 1 : watchedPrice) || 0;

  // Check for insufficient funds when amount or direction changes
  useEffect(() => {
    if (
      watchedType === "transfer" &&
      watchedTransferDirection === "send" &&
      user
    ) {
      setInsufficientFunds(watchedAmount > user.budget.cash);
    } else if (watchedType === "buy" && user) {
      setInsufficientFunds(totalValue > user.budget.cash);
    } else {
      setInsufficientFunds(false);
    }
  }, [watchedAmount, watchedTransferDirection, watchedType, totalValue, user]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Reset error states
    setIsSubmitting(true);
    setError(null);

    // Validate sufficient funds for send transfers and buy transactions
    if (
      ((values.type === "transfer" && values.transferDirection === "send") ||
        values.type === "buy") &&
      user &&
      values.amount > user.budget.cash
    ) {
      setError(t("insufficientFundsError"));
      setIsSubmitting(false);
      toast({
        title: t("transactionFailed"),
        description: t("insufficientFundsError"),
        variant: "destructive",
      });
      return;
    }

    // Override the price for transfers so the API receives a valid value.
    const submitValues = { ...values };
    if (values.type === "transfer") {
      // For transfers, the price is not entered so we set it to 1.
      submitValues.price = 1;
    }

    try {
      // Process the transaction through the user context
      const transaction = await processTransaction(
        submitValues as TransactionFormData
      );

      if (values.type === "transfer") {
        const isSending = values.transferDirection === "send";
        // Compute new cash balance based on current cash and transfer amount
        const newCash = user
          ? isSending
            ? user.budget.cash - values.amount
            : user.budget.cash + values.amount
          : 0;
        toast({
          title: t("transactionSubmitted"),
          description: isSending
            ? `${t("moneySent")}: ${values.amount} ${values.asset} ${t(
                "from"
              )} ${t("yourAccount")}. ${t("newBalance")}: $${newCash.toFixed(
                2
              )}. ${t("transactionHistoryWillUpdate")}`
            : `${t("moneyReceived")}: ${values.amount} ${values.asset} ${t(
                "to"
              )} ${t("yourAccount")}. ${t("newBalance")}: $${newCash.toFixed(
                2
              )}. ${t("transactionHistoryWillUpdate")}`,
          variant: "default",
        });
      } else {
        toast({
          title: t("transactionSubmitted"),
          description: `${values.type === "buy" ? t("bought") : t("sold")} ${
            values.amount
          } ${values.asset} at $${submitValues.price}. ${t(
            "transactionHistoryWillUpdate"
          )}`,
          variant: "default",
        });
      }

      // Set the completed transaction to display confirmation
      setCompletedTransaction(transaction);

      // Reset the form
      form.reset({
        type: "buy",
        asset: "",
        amount: 0,
        price: 0,
        transferDirection: "send",
      });

      // Notify parent component if callback provided
      if (onTransactionComplete) {
        onTransactionComplete();
      }
    } catch (err) {
      console.error("Transaction error:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to submit transaction";
      setError(errorMessage);

      toast({
        title: t("transactionFailed"),
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("transactionType")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("selectTransactionType")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="buy">{t("buy")}</SelectItem>
                      <SelectItem value="sell">{t("sell")}</SelectItem>
                      <SelectItem value="transfer">{t("transfer")}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="asset"
              render={({ field }) => {
                const assetOptions =
                  form.watch("type") === "transfer" ? transferAssets : assets;
                return (
                  <FormItem>
                    <FormLabel>{t("asset")}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t("selectAsset")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {assetOptions.map((asset) => (
                          <SelectItem key={asset.id} value={asset.id}>
                            <div className="flex items-center gap-2">
                              <span>{asset.icon}</span>
                              <span>
                                {asset.id} - {asset.name}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {form.watch("type") !== "transfer" ? (
              <>
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("sharesUnits")}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          {...field}
                          onFocus={(e) => {
                            if (
                              e.target.value === "0" ||
                              Number(e.target.value) === 0
                            ) {
                              e.target.value = "";
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("pricePerShare")}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          {...field}
                          onFocus={(e) => {
                            if (
                              e.target.value === "0" ||
                              Number(e.target.value) === 0
                            ) {
                              e.target.value = "";
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            ) : (
              <>
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("transferAmount")}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          {...field}
                          onFocus={(e) => {
                            if (
                              e.target.value === "0" ||
                              Number(e.target.value) === 0
                            ) {
                              e.target.value = "";
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="transferDirection"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("transferDirection")}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={t("selectTransferDirection")}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="send">{t("sendMoney")}</SelectItem>
                          <SelectItem value="receive">
                            {t("receiveMoney")}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>

          <div className="rounded-lg border p-4 bg-muted/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">
                  {t("totalTransactionValue")}
                </span>
              </div>
              <div className="text-lg font-bold">
                {hideBalance ? "•••••" : `$${totalValue.toFixed(2)}`}
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {watchedType === "buy" ||
              (watchedType === "transfer" &&
                watchedTransferDirection === "send")
                ? t("deductedFromCash")
                : t("addedToCash")}
            </p>
            {!hideBalance && user && (
              <div className="mt-2 flex justify-between items-center text-sm">
                <span>{t("availableCash")}</span>
                <span className="font-medium">
                  ${user.budget.cash.toFixed(2)}
                </span>
              </div>
            )}
          </div>

          {insufficientFunds && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{t("insufficientFunds")}</AlertTitle>
              <AlertDescription>
                {t("insufficientFundsDescription")}
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <div className="rounded-lg border border-destructive p-4 bg-destructive/10">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <span className="text-sm font-medium text-destructive">
                  {error}
                </span>
              </div>
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || insufficientFunds}
          >
            {isSubmitting ? (
              <>
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                {t("processing")}
              </>
            ) : (
              t("submitTransaction")
            )}
          </Button>
        </form>
      </Form>

      {completedTransaction && (
        <TransactionConfirmation
          transaction={completedTransaction}
          onDismiss={() => setCompletedTransaction(null)}
        />
      )}
    </div>
  );
}
