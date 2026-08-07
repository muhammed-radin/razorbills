import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"

export default function FeaturesSection({ features, updateFeature, removeFeature, addFeature }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Features</CardTitle>
                <CardDescription>
                    Add product features/highlights
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {features.map((feature, index) => (
                    <div key={index} className="flex gap-2">
                        <Input
                            value={feature}
                            onChange={(e) => updateFeature(index, e.target.value)}
                            placeholder="Product feature"
                        />
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => removeFeature(index)}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addFeature}
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Feature
                </Button>
            </CardContent>
        </Card>
    )
}
