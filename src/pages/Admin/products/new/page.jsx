import { useState, useRef } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import {
    ArrowLeft,
    Plus,
    Trash2,
    Save,
    Loader2,
    Upload,
    Link as LinkIcon,
    Check,
    ChevronsUpDown,
    X,
    Image as ImageIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { api } from "@/utils/api"
import axios from "axios"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const defaultCategories = [
    "Electronics",
    "Accessories",
    "Audio",
    "Lighting",
    "Mobile",
    "Computers",
    "Gaming",
    "Home Appliances",
    "Wearables",
    "Other",
]

// Cloudinary configuration - update these with your credentials
const CLOUDINARY_UPLOAD_PRESET = "your_upload_preset"
const CLOUDINARY_CLOUD_NAME = "your_cloud_name"
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`

export default function NewProductPage() {
    const navigate = useNavigate()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [specifications, setSpecifications] = useState([{ label: "", value: "" }])
    const [features, setFeatures] = useState([""])
    const [tags, setTags] = useState([])
    const [keywords, setKeywords] = useState([])
    const [tagInput, setTagInput] = useState("")
    const [keywordInput, setKeywordInput] = useState("")

    // Image states
    const [thumbnail, setThumbnail] = useState({ url: "", file: null, preview: "" })
    const [additionalImages, setAdditionalImages] = useState([])

    // Category combobox states
    const [categories, setCategories] = useState(defaultCategories)
    const [categoryOpen, setCategoryOpen] = useState(false)
    const [categorySearch, setCategorySearch] = useState("")

    const thumbnailInputRef = useRef(null)
    const additionalImageInputRef = useRef(null)

    const form = useForm({
        defaultValues: {
            id: "",
            title: "",
            price: 0,
            originalPrice: 0,
            thumbnail: "",
            description: "",
            category: "",
            stock: 0,
            brand: "",
            tax: 0,
            detailedDescription: "",
            rating: 4.5,
            reviewCount: 0,
            width: 0,
            height: 0,
            depth: 0,
            weight: 0,
            isActive: true,
            currency: "INR",
            warranty: "",
            returnPolicy: "",
            shippingDetails: "",
            sku: "",
        },
    })

    // Prevent form submission on Enter key
    const handleKeyDown = (e) => {
        if (e.key === "Enter" && e.target.tagName !== "TEXTAREA") {
            e.preventDefault()
        }
    }

    const addSpecification = () => {
        setSpecifications([...specifications, { label: "", value: "" }])
    }

    const removeSpecification = (index) => {
        setSpecifications(specifications.filter((_, i) => i !== index))
    }

    const updateSpecification = (index, field, value) => {
        const updated = [...specifications]
        updated[index][field] = value
        setSpecifications(updated)
    }

    const addFeature = () => {
        setFeatures([...features, ""])
    }

    const removeFeature = (index) => {
        setFeatures(features.filter((_, i) => i !== index))
    }

    const updateFeature = (index, value) => {
        const updated = [...features]
        updated[index] = value
        setFeatures(updated)
    }

    // Tag handling
    const handleTagInputKeyDown = (e) => {
        if (e.key === "Enter" || e.key === "," || e.key === " ") {
            e.preventDefault()
            addTagsFromInput()
        }
    }

    const addTagsFromInput = () => {
        const newTags = tagInput
            .split(/[,\s]+/)
            .map(t => t.trim())
            .filter(t => t && !tags.includes(t))
        if (newTags.length > 0) {
            setTags([...tags, ...newTags])
        }
        setTagInput("")
    }

    const removeTag = (tagToRemove) => {
        setTags(tags.filter(t => t !== tagToRemove))
    }

    // Keyword handling
    const handleKeywordInputKeyDown = (e) => {
        if (e.key === "Enter" || e.key === "," || e.key === " ") {
            e.preventDefault()
            addKeywordsFromInput()
        }
    }

    const addKeywordsFromInput = () => {
        const newKeywords = keywordInput
            .split(/[,\s]+/)
            .map(k => k.trim())
            .filter(k => k && !keywords.includes(k))
        if (newKeywords.length > 0) {
            setKeywords([...keywords, ...newKeywords])
        }
        setKeywordInput("")
    }

    const removeKeyword = (keywordToRemove) => {
        setKeywords(keywords.filter(k => k !== keywordToRemove))
    }

    // Image handling
    const handleThumbnailFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            const preview = URL.createObjectURL(file)
            setThumbnail({ url: "", file, preview })
        }
    }

    const handleThumbnailUrlChange = (url) => {
        setThumbnail({ url, file: null, preview: url })
    }

    const handleAdditionalImageFileChange = (e) => {
        const files = Array.from(e.target.files)
        const newImages = files.map(file => ({
            url: "",
            file,
            preview: URL.createObjectURL(file)
        }))
        setAdditionalImages([...additionalImages, ...newImages])
    }

    const addAdditionalImageUrl = () => {
        setAdditionalImages([...additionalImages, { url: "", file: null, preview: "" }])
    }

    const updateAdditionalImageUrl = (index, url) => {
        const updated = [...additionalImages]
        updated[index] = { url, file: null, preview: url }
        setAdditionalImages(updated)
    }

    const removeAdditionalImage = (index) => {
        const updated = [...additionalImages]
        if (updated[index].preview && updated[index].file) {
            URL.revokeObjectURL(updated[index].preview)
        }
        updated.splice(index, 1)
        setAdditionalImages(updated)
    }

    // Upload image to Cloudinary
    const uploadToCloudinary = async (file) => {
        const formData = new FormData()
        formData.append("file", file)
        formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET)

        const response = await axios.post(CLOUDINARY_UPLOAD_URL, formData)
        return response.data.secure_url
    }

    // Add new category
    const addNewCategory = (newCategory) => {
        if (newCategory && !categories.includes(newCategory)) {
            setCategories([...categories, newCategory])
        }
    }

    const onSubmit = async (data) => {
        setIsSubmitting(true)
        try {
            // Upload thumbnail if it's a file
            let thumbnailUrl = thumbnail.url
            if (thumbnail.file) {
                thumbnailUrl = await uploadToCloudinary(thumbnail.file)
            }

            // Upload additional images
            const imageUrls = await Promise.all(
                additionalImages.map(async (img) => {
                    if (img.file) {
                        return await uploadToCloudinary(img.file)
                    }
                    return img.url
                })
            )

            const productData = {
                ...data,
                thumbnail: thumbnailUrl,
                specifications: specifications.filter(s => s.label && s.value),
                features: features.filter(f => f.trim() !== ""),
                images: imageUrls.filter(i => i && i.trim() !== ""),
                tags: tags,
                keywords: keywords,
                dimensions: {
                    width: parseFloat(data.width) || 0,
                    height: parseFloat(data.height) || 0,
                    depth: parseFloat(data.depth) || 0,
                },
                price: parseFloat(data.price) || 0,
                originalPrice: parseFloat(data.originalPrice) || 0,
                stock: parseInt(data.stock) || 0,
                tax: parseFloat(data.tax) || 0,
                weight: parseFloat(data.weight) || 0,
                rating: parseFloat(data.rating) || 4.5,
                reviewCount: parseInt(data.reviewCount) || 0,
            }

            // Remove individual dimension fields
            delete productData.width
            delete productData.height
            delete productData.depth

            await axios.post(api.products(), productData)
            toast.success("Product created successfully!")
            navigate("/admin/products")
        } catch (error) {
            console.error("Error creating product:", error)
            toast.error(error.response?.data?.message || "Failed to create product")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link to="/admin/products">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Create Product</h1>
                    <p className="text-muted-foreground">
                        Add a new product to your inventory
                    </p>
                </div>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} onKeyDown={handleKeyDown} className="space-y-6">
                    {/* Basic Information */}
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
                                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                                {field.value}
                                                            </ReactMarkdown>
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

                    {/* Pricing */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Pricing & Inventory</CardTitle>
                            <CardDescription>
                                Set the pricing and stock information
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-6 md:grid-cols-3">
                            <FormField
                                control={form.control}
                                name="price"
                                rules={{ required: "Price is required", min: { value: 0, message: "Price must be positive" } }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Selling Price *</FormLabel>
                                        <FormControl>
                                            <Input type="number" step="0.01" placeholder="0.00" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="originalPrice"
                                rules={{ required: "Original price is required" }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Original Price (MRP) *</FormLabel>
                                        <FormControl>
                                            <Input type="number" step="0.01" placeholder="0.00" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="tax"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tax (%)</FormLabel>
                                        <FormControl>
                                            <Input type="number" step="0.01" placeholder="0" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="stock"
                                rules={{ required: "Stock is required" }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Stock Quantity *</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="0" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="currency"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Currency</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select currency" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="INR">INR (₹)</SelectItem>
                                                <SelectItem value="USD">USD ($)</SelectItem>
                                                <SelectItem value="EUR">EUR (€)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="isActive"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-6">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel>Active</FormLabel>
                                            <FormDescription>
                                                Product is visible to customers
                                            </FormDescription>
                                        </div>
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    {/* Images */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Images</CardTitle>
                            <CardDescription>
                                Add product images (upload or URL)
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Thumbnail */}
                            <div className="space-y-4">
                                <Label>Thumbnail *</Label>
                                <div className="flex gap-4 items-start">
                                    <div className="flex-1 space-y-2">
                                        <div className="flex gap-2">
                                            <Input
                                                placeholder="https://example.com/image.jpg"
                                                value={thumbnail.url}
                                                onChange={(e) => handleThumbnailUrlChange(e.target.value)}
                                            />
                                            <input
                                                type="file"
                                                accept="image/*"
                                                ref={thumbnailInputRef}
                                                className="hidden"
                                                onChange={handleThumbnailFileChange}
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="icon"
                                                onClick={() => thumbnailInputRef.current?.click()}
                                            >
                                                <Upload className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Enter URL or upload from device
                                        </p>
                                    </div>
                                    {thumbnail.preview && (
                                        <div className="relative w-24 h-24 rounded-md overflow-hidden border">
                                            <img
                                                src={thumbnail.preview}
                                                alt="Thumbnail preview"
                                                className="w-full h-full object-cover"
                                            />
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="icon"
                                                className="absolute top-1 right-1 h-6 w-6"
                                                onClick={() => setThumbnail({ url: "", file: null, preview: "" })}
                                            >
                                                <X className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Additional Images */}
                            <div className="space-y-4">
                                <Label>Additional Images</Label>
                                <div className="flex gap-2 flex-wrap">
                                    {additionalImages.map((img, index) => (
                                        <div key={index} className="space-y-2">
                                            {img.preview ? (
                                                <div className="relative w-24 h-24 rounded-md overflow-hidden border">
                                                    <img
                                                        src={img.preview}
                                                        alt={`Additional image ${index + 1}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="icon"
                                                        className="absolute top-1 right-1 h-6 w-6"
                                                        onClick={() => removeAdditionalImage(index)}
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            ) : (
                                                <div className="flex gap-2 items-center">
                                                    <Input
                                                        value={img.url}
                                                        onChange={(e) => updateAdditionalImageUrl(index, e.target.value)}
                                                        placeholder="https://example.com/image.jpg"
                                                        className="w-64"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() => removeAdditionalImage(index)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        ref={additionalImageInputRef}
                                        className="hidden"
                                        onChange={handleAdditionalImageFileChange}
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => additionalImageInputRef.current?.click()}
                                    >
                                        <Upload className="mr-2 h-4 w-4" />
                                        Upload Images
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={addAdditionalImageUrl}
                                    >
                                        <LinkIcon className="mr-2 h-4 w-4" />
                                        Add URL
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Specifications */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Specifications</CardTitle>
                            <CardDescription>
                                Add technical specifications
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {specifications.map((spec, index) => (
                                <div key={index} className="flex gap-2">
                                    <Input
                                        value={spec.label}
                                        onChange={(e) => updateSpecification(index, "label", e.target.value)}
                                        placeholder="Specification name"
                                        className="flex-1"
                                    />
                                    <Input
                                        value={spec.value}
                                        onChange={(e) => updateSpecification(index, "value", e.target.value)}
                                        placeholder="Specification value"
                                        className="flex-1"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        onClick={() => removeSpecification(index)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={addSpecification}
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Add Specification
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Features */}
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

                    {/* Dimensions & Weight */}
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

                    {/* Tags & Keywords */}
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

                    {/* Additional Information */}
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

                    {/* Submit Button */}
                    <div className="flex justify-end gap-4">
                        <Button type="button" variant="outline" asChild>
                            <Link to="/admin/products">Cancel</Link>
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    Create Product
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}
