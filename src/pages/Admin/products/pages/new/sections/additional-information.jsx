import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function AdditionalInformationSection({ form }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Additional Information</CardTitle>
                <CardDescription>
                    Warranty, returns and shipping details
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-1">
                <FormField
                    control={form.control}
                    name="warranty"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Warranty</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., 1 Year Manufacturer Warranty" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="returnPolicy"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Return Policy</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Describe the return policy"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="shippingDetails"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Shipping Details</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Describe shipping information"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </CardContent>
        </Card>
    )
}
