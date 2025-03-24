"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ArrowRightLeft, AlertCircle } from "lucide-react";

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

const formSchema = z.object({
  type: z.enum(["buy", "sell", "transfer"]),
  asset: z.string().min(1, {
    message: "Please select an asset.",
  }),
  amount: z.coerce.number().positive({
    message: "Amount must be a positive number.",
  }),
  price: z.coerce.number().positive({
    message: "Price must be a positive number.",
  }),
  transferDirection: z.enum(["send", "receive"]).optional(), // new field for transfer
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
  const { t } = useTranslation();
  const { hideBalance } = useSettings();
  const { processTransaction } = useUser();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "buy",
      asset: "",
      amount: 0,
      price: 0,
      transferDirection: "send", // default direction for transfers
    },
  });

  const watchedType = form.watch("type");
  const watchedAmount = form.watch("amount");
  const watchedPrice = form.watch("price");
  const totalValue =
    watchedAmount * (watchedType === "transfer" ? 1 : watchedPrice) || 0;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Submit event triggered with values:", values); // Debug log added
    setIsSubmitting(true);
    setError(null);

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

      // Show success toast
      toast({
        title: t("transactionSubmitted"),
        description: `${
          values.type === "buy"
            ? t("bought")
            : values.type === "sell"
            ? t("sold")
            : t("transferred")
        } ${values.amount} ${values.asset} at $${submitValues.price}`,
        variant: "default",
      });

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
      setError(
        err instanceof Error ? err.message : "Failed to submit transaction"
      );

      toast({
        title: t("transactionFailed"),
        description:
          err instanceof Error ? err.message : "Failed to submit transaction",
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
                        <Input type="number" step="0.01" {...field} />
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
                        <Input type="number" step="0.01" {...field} />
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
                        <Input type="number" step="0.01" {...field} />
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
              {form.watch("type") === "buy"
                ? t("deductedFromCash")
                : t("addedToCash")}
            </p>
          </div>

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
            onClick={() => console.log("Submit button clicked")} // Debug log added
            className="w-full"
            disabled={isSubmitting}
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
