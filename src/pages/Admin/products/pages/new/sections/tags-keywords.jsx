import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

export default function TagsKeywordsSection({
    tagInput,
    setTagInput,
    handleTagInputKeyDown,
    addTagsFromInput,
    tags,
    removeTag,
    keywordInput,
    setKeywordInput,
    handleKeywordInputKeyDown,
    addKeywordsFromInput,
    keywords,
    removeKeyword
}) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Tags & Keywords</CardTitle>
                <CardDescription>
                    Add tags and keywords for search optimization (press Enter, Space, or Comma to add)
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                    <Label>Tags</Label>
                    <div className="space-y-2">
                        <Input
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={handleTagInputKeyDown}
                            onBlur={addTagsFromInput}
                            placeholder="Type and press Enter, Space, or Comma to add tags"
                        />
                        <div className="flex flex-wrap gap-2 min-h-[40px] p-2 border rounded-md">
                            {tags.length === 0 && (
                                <span className="text-muted-foreground text-sm">No tags added</span>
                            )}
                            {tags.map((tag, index) => (
                                <Badge key={index} variant="secondary" className="gap-1">
                                    {tag}
                                    <button
                                        type="button"
                                        onClick={() => removeTag(tag)}
                                        className="ml-1 hover:bg-muted rounded-full"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </Badge>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="space-y-4">
                    <Label>Keywords</Label>
                    <div className="space-y-2">
                        <Input
                            value={keywordInput}
                            onChange={(e) => setKeywordInput(e.target.value)}
                            onKeyDown={handleKeywordInputKeyDown}
                            onBlur={addKeywordsFromInput}
                            placeholder="Type and press Enter, Space, or Comma to add keywords"
                        />
                        <div className="flex flex-wrap gap-2 min-h-[40px] p-2 border rounded-md">
                            {keywords.length === 0 && (
                                <span className="text-muted-foreground text-sm">No keywords added</span>
                            )}
                            {keywords.map((keyword, index) => (
                                <Badge key={index} variant="outline" className="gap-1">
                                    {keyword}
                                    <button
                                        type="button"
                                        onClick={() => removeKeyword(keyword)}
                                        className="ml-1 hover:bg-muted rounded-full"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </Badge>
                            ))}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
