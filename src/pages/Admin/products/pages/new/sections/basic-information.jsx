import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import { Button } from "@/components/ui/button"
import { Check, ChevronsUpDown, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import StyledMd from "@/components/styled-md"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"


export default function BasicInformationSection({ form, categories, categoryOpen, setCategoryOpen, categorySearch, setCategorySearch, addNewCategory }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                    Enter the basic details of your product
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
                <FormField
                    control={form.control}
                    name="id"
                    rules={{ required: "Product ID is required" }}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Product ID *</FormLabel>
                            <FormControl>
                                <Input placeholder="unique-product-id" {...field} />
                            </FormControl>
                            <FormDescription>Unique identifier for the product</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="sku"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>SKU</FormLabel>
                            <FormControl>
                                <Input placeholder="111 222 33" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="title"
                    rules={{ required: "Title is required" }}
                    render={({ field }) => (
                        <FormItem className="md:col-span-2">
                            <FormLabel>Title *</FormLabel>
                            <FormControl>
                                <Input placeholder="Product name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="brand"
                    rules={{ required: "Brand is required" }}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Brand *</FormLabel>
                            <FormControl>
                                <Input placeholder="Brand name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {/* Category Combobox */}
                <FormField
                    control={form.control}
                    name="category"
                    rules={{ required: "Category is required" }}
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Category *</FormLabel>
                            <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={categoryOpen}
                                            className={cn(
                                                "justify-between",
                                                !field.value && "text-muted-foreground"
                                            )}
                                        >
                                            {field.value || "Select a category"}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-[300px] p-0">
                                    <Command>
                                        <CommandInput
                                            placeholder="Search or add category..."
                                            value={categorySearch}
                                            onValueChange={setCategorySearch}
                                        />
                                        <CommandList>
                                            <CommandEmpty>
                                                <div className="p-2">
                                                    <p className="text-sm text-muted-foreground mb-2">
                                                        No category found.
                                                    </p>
                                                    {categorySearch && (
                                                        <Button
                                                            type="button"
                                                            size="sm"
                                                            onClick={() => {
                                                                addNewCategory(categorySearch)
                                                                field.onChange(categorySearch)
                                                                setCategorySearch("")
                                                                setCategoryOpen(false)
                                                            }}
                                                        >
                                                            <Plus className="mr-2 h-4 w-4" />
                                                            Add "{categorySearch}"
                                                        </Button>
                                                    )}
                                                </div>
                                            </CommandEmpty>
                                            <CommandGroup>
                                                {categories.map((category) => (
                                                    <CommandItem
                                                        key={category}
                                                        value={category}
                                                        onSelect={() => {
                                                            field.onChange(category)
                                                            setCategoryOpen(false)
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                field.value === category ? "opacity-100" : "opacity-0"
                                                            )}
                                                        />
                                                        {category}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    rules={{ required: "Description is required" }}
                    render={({ field }) => (
                        <FormItem className="md:col-span-2">
                            <FormLabel>Short Description *</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Brief description of the product"
                                    className="min-h-[100px]"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {/* Detailed Description with Markdown Editor */}
                <FormField
                    control={form.control}
                    name="detailedDescription"
                    render={({ field }) => (
                        <FormItem className="md:col-span-2">
                            <FormLabel>Detailed Description</FormLabel>
                            <FormControl>
                                <Tabs defaultValue="write" className="w-full">
                                    <TabsList>
                                        <TabsTrigger value="write">Write</TabsTrigger>
                                        <TabsTrigger value="preview">Preview</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="write">
                                        <Textarea
                                            placeholder="Write detailed description using Markdown..."
                                            className="min-h-[200px] font-mono"
                                            {...field}
                                        />
                                    </TabsContent>
                                    <TabsContent value="preview">
                                        <div className="min-h-[200px] rounded-md border p-4 prose prose-sm dark:prose-invert max-w-none">
                                            {field.value ? (
                                               <StyledMd>{field.value}</StyledMd>
                                            ) : (
                                                <p className="text-muted-foreground">Nothing to preview</p>
                                            )}
                                        </div>
                                    </TabsContent>
                                </Tabs>
                            </FormControl>
                            <FormDescription>
                                Supports Markdown formatting (bold, italic, lists, links, etc.)
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </CardContent>
        </Card>
    )
}
