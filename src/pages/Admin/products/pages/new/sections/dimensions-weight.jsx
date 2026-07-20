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

export default function DimensionsWeightSection({ form }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Dimensions & Weight</CardTitle>
                <CardDescription>
                    Physical attributes of the product
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-4">
                <FormField
                    control={form.control}
                    name="width"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Width (cm)</FormLabel>
                            <FormControl>
                                <Input type="number" step="0.1" placeholder="0" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="height"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Height (cm)</FormLabel>
                            <FormControl>
                                <Input type="number" step="0.1" placeholder="0" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="depth"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Depth (cm)</FormLabel>
                            <FormControl>
                                <Input type="number" step="0.1" placeholder="0" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Weight (kg)</FormLabel>
                            <FormControl>
                                <Input type="number" step="0.01" placeholder="0" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </CardContent>
        </Card>
    )
}
