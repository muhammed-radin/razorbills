import { useState, useEffect, useRef } from "react"
import { useNavigate, useParams, Link } from "react-router-dom"
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
    AlertCircle,
    Sparkles,
    Package,
    RefreshCw,
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

export default function EditProductPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
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

    useEffect(() => {
        fetchProduct()
    }, [id])

    const fetchProduct = async () => {
        try {
            setIsLoading(true)
            const response = await axios.get(api.products(id))
            const product = response.data

            // Set form values
            form.reset({
                id: product.id || "",
                title: product.title || "",
                price: product.price || 0,
                originalPrice: product.originalPrice || 0,
                thumbnail: product.thumbnail || "",
                description: product.description || "",
                category: product.category || "",
                stock: product.stock || 0,
                brand: product.brand || "",
                tax: product.tax || 0,
                detailedDescription: product.detailedDescription || "",
                rating: product.rating || 4.5,
                reviewCount: product.reviewCount || 0,
                width: product.dimensions?.width || 0,
                height: product.dimensions?.height || 0,
                depth: product.dimensions?.depth || 0,
                weight: product.weight || 0,
                isActive: product.isActive !== undefined ? product.isActive : true,
                currency: product.currency || "INR",
                warranty: product.warranty || "",
                returnPolicy: product.returnPolicy || "",
                shippingDetails: product.shippingDetails || "",
                sku: product.sku || "",
            })

            // Set thumbnail
            if (product.thumbnail) {
                setThumbnail({ url: product.thumbnail, file: null, preview: product.thumbnail })
            }

            // Set additional images
            if (product.images && product.images.length > 0) {
                setAdditionalImages(
                    product.images.map(url => ({ url, file: null, preview: url }))
                )
            }

            // Set specifications
            if (product.specifications && product.specifications.length > 0) {
                setSpecifications(product.specifications)
            }

            // Set features
            if (product.features && product.features.length > 0) {
                setFeatures(product.features)
            }

            // Set tags
            if (product.tags && product.tags.length > 0) {
                setTags(product.tags)
            }

            // Set keywords
            if (product.keywords && product.keywords.length > 0) {
                setKeywords(product.keywords)
            }

            toast.success("Product loaded successfully!")
        } catch (error) {
            console.error("Error fetching product:", error)
            toast.error("Failed to load product")
            navigate("/admin/products")
        } finally {
            setIsLoading(false)
        }
    }

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

            await axios.put(api.products(id), productData)
            toast.success("Product updated successfully!")
            navigate("/admin/products")
        } catch (error) {
            console.error("Error updating product:", error)
            toast.error(error.response?.data?.message || "Failed to update product")
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
                <div className="flex flex-col items-center gap-6">
                    <div className="relative">
                        <div className="h-20 w-20 animate-spin rounded-full border-4 border-muted border-t-primary"></div>
                        <Package className="h-8 w-8 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <div className="text-center">
                        <p className="text-xl font-semibold text-foreground mb-1">Loading Product</p>
                        <p className="text-sm text-muted-foreground">Please wait while we fetch the details...</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
            <div className="container mx-auto p-6 space-y-8">
                {/* Beautiful Hero Header */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary via-primary/90 to-primary/80 p-8 text-primary-foreground shadow-2xl">
                    <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary-foreground/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-primary-foreground/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                    <div className="absolute top-10 right-20 w-32 h-32 bg-primary-foreground/5 rounded-full blur-2xl"></div>
                    <div className="absolute bottom-10 left-20 w-40 h-40 bg-primary-foreground/5 rounded-full blur-2xl"></div>

                    <div className="relative z-10">
                        <div className="flex flex-col items-start gap-4 mb-6">
                            <Button
                                variant="secondary"
                                size="icon"
                                className="h-12 w-12 rounded-full shadow-xl hover:scale-110 transition-transform duration-300"
                                asChild
                            >
                                <Link to="/admin/products">
                                    <ArrowLeft className="h-5 w-5" />
                                </Link>
                            </Button>

                            <div className="flex items-center gap-3">
                                <div className="h-14 w-14 rounded-2xl bg-primary-foreground/20 backdrop-blur flex items-center justify-center">
                                    <Sparkles className="h-7 w-7 text-primary-foreground" />
                                </div>
                                <div>
                                    <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
                                        Edit Product
                                        <Badge className="bg-primary-foreground/20 text-primary-foreground border-0 text-sm px-3 py-1">
                                            ID: {id}
                                        </Badge>
                                    </h1>
                                    <p className="text-primary-foreground/80 text-lg mt-1">
                                        Update and enhance your product details
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 mt-6">
                            <div className="h-1.5 w-1.5 rounded-full bg-primary-foreground/60 animate-pulse"></div>
                            <p className="text-sm text-primary-foreground/70">Make changes and save to update the product</p>
                        </div>
                    </div>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} onKeyDown={handleKeyDown} className="space-y-6">
                        {/* Basic Information */}
                        <Card className="overflow-hidden border-2 hover:border-primary/50 transition-colors duration-300 shadow-lg hover:shadow-xl">
                            <CardHeader className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border-b">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                        <Package className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-2xl">Basic Information</CardTitle>
                                        <CardDescription className="text-base">
                                            Update the core details of your product
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="grid gap-6 md:grid-cols-2 pt-6">
                                <FormField
                                    control={form.control}
                                    name="id"
                                    rules={{ required: "Product ID is required" }}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-base font-semibold">Product ID *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="unique-product-id"
                                                    className="h-11 border-2 focus-visible:border-primary"
                                                    {...field}
                                                    disabled
                                                />
                                            </FormControl>
                                            <FormDescription>Unique identifier (cannot be changed)</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="sku"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-base font-semibold">SKU</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="111 222 33"
                                                    className="h-11 border-2 focus-visible:border-primary"
                                                    {...field}
                                                />
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
                                            <FormLabel className="text-base font-semibold">Title *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Product name"
                                                    className="h-11 border-2 focus-visible:border-primary"
                                                    {...field}
                                                />
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
                                            <FormLabel className="text-base font-semibold">Brand *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Brand name"
                                                    className="h-11 border-2 focus-visible:border-primary"
                                                    {...field}
                                                />
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
                                            <FormLabel className="text-base font-semibold">Category *</FormLabel>
                                            <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant="outline"
                                                            role="combobox"
                                                            aria-expanded={categoryOpen}
                                                            className={cn(
                                                                "justify-between h-11 border-2 hover:border-primary",
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
                                            <FormLabel className="text-base font-semibold">Short Description *</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Brief description of the product"
                                                    className="min-h-[120px] border-2 focus-visible:border-primary resize-none"
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
                                            <FormLabel className="text-base font-semibold">Detailed Description</FormLabel>
                                            <FormControl>
                                                <Tabs defaultValue="write" className="w-full">
                                                    <TabsList className="grid w-full grid-cols-2">
                                                        <TabsTrigger value="write">Write</TabsTrigger>
                                                        <TabsTrigger value="preview">Preview</TabsTrigger>
                                                    </TabsList>
                                                    <TabsContent value="write">
                                                        <Textarea
                                                            placeholder="Write detailed description using Markdown..."
                                                            className="min-h-[250px] font-mono border-2 focus-visible:border-primary"
                                                            {...field}
                                                        />
                                                    </TabsContent>
                                                    <TabsContent value="preview">
                                                        <div className="min-h-[250px] rounded-lg border-2 p-6 prose prose-sm dark:prose-invert max-w-none bg-muted/30">
                                                            {field.value ? (
                                                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                                    {field.value}
                                                                </ReactMarkdown>
                                                            ) : (
                                                                <p className="text-muted-foreground italic">Nothing to preview</p>
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
                        <Card className="overflow-hidden border-2 hover:border-primary/50 transition-colors duration-300 shadow-lg hover:shadow-xl">
                            <CardHeader className="bg-gradient-to-r from-green-500/5 via-green-500/10 to-green-500/5 border-b">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                                        <span className="text-xl">💰</span>
                                    </div>
                                    <div>
                                        <CardTitle className="text-2xl">Pricing & Inventory</CardTitle>
                                        <CardDescription className="text-base">
                                            Update pricing and stock information
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="grid gap-6 md:grid-cols-3 pt-6">
                                <FormField
                                    control={form.control}
                                    name="price"
                                    rules={{ required: "Price is required", min: { value: 0, message: "Price must be positive" } }}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-base font-semibold">Selling Price *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    placeholder="0.00"
                                                    className="h-11 border-2 focus-visible:border-primary"
                                                    {...field}
                                                />
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
                                            <FormLabel className="text-base font-semibold">Original Price (MRP) *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    placeholder="0.00"
                                                    className="h-11 border-2 focus-visible:border-primary"
                                                    {...field}
                                                />
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
                                            <FormLabel className="text-base font-semibold">Tax (%)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    placeholder="0"
                                                    className="h-11 border-2 focus-visible:border-primary"
                                                    {...field}
                                                />
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
                                            <FormLabel className="text-base font-semibold">Stock Quantity *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="0"
                                                    className="h-11 border-2 focus-visible:border-primary"
                                                    {...field}
                                                />
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
                                            <FormLabel className="text-base font-semibold">Currency</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="h-11 border-2 hover:border-primary">
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
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-6 rounded-lg border-2 p-4 bg-muted/30">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                    className="mt-1"
                                                />
                                            </FormControl>
                                            <div className="space-y-1 leading-none">
                                                <FormLabel className="text-base font-semibold cursor-pointer">Active Product</FormLabel>
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
                        <Card className="overflow-hidden border-2 hover:border-primary/50 transition-colors duration-300 shadow-lg hover:shadow-xl">
                            <CardHeader className="bg-gradient-to-r from-purple-500/5 via-purple-500/10 to-purple-500/5 border-b">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                                        <ImageIcon className="h-5 w-5 text-purple-500" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-2xl">Product Images</CardTitle>
                                        <CardDescription className="text-base">
                                            Update product images (upload or URL)
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6 pt-6">
                                {/* Thumbnail */}
                                <div className="space-y-4">
                                    <Label className="text-base font-semibold">Thumbnail *</Label>
                                    <div className="flex gap-4 items-start flex-col sm:flex-row">
                                        <div className="flex-1 w-full space-y-2">
                                            <div className="flex gap-2">
                                                <Input
                                                    placeholder="https://example.com/image.jpg"
                                                    value={thumbnail.url}
                                                    onChange={(e) => handleThumbnailUrlChange(e.target.value)}
                                                    className="h-11 border-2 focus-visible:border-primary"
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
                                                    className="h-11 w-11 border-2"
                                                    onClick={() => thumbnailInputRef.current?.click()}
                                                >
                                                    <Upload className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                Enter URL or upload from device
                                            </p>
                                        </div>
                                        {thumbnail.preview && (
                                            <div className="relative group">
                                                <div className="w-32 h-32 rounded-xl overflow-hidden border-2 border-primary/20 shadow-lg">
                                                    <img
                                                        src={thumbnail.preview}
                                                        alt="Thumbnail preview"
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                    />
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="icon"
                                                    className="absolute -top-2 -right-2 h-8 w-8 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                                    onClick={() => setThumbnail({ url: "", file: null, preview: "" })}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Additional Images */}
                                <div className="space-y-4">
                                    <Label className="text-base font-semibold">Additional Images</Label>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                        {additionalImages.map((img, index) => (
                                            <div key={index} className="space-y-2">
                                                {img.preview ? (
                                                    <div className="relative group">
                                                        <div className="aspect-square rounded-xl overflow-hidden border-2 border-primary/20 shadow-lg">
                                                            <img
                                                                src={img.preview}
                                                                alt={`Additional image ${index + 1}`}
                                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                            />
                                                        </div>
                                                        <Button
                                                            type="button"
                                                            variant="destructive"
                                                            size="icon"
                                                            className="absolute -top-2 -right-2 h-8 w-8 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                                            onClick={() => removeAdditionalImage(index)}
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <div className="flex gap-2 items-center">
                                                        <Input
                                                            value={img.url}
                                                            onChange={(e) => updateAdditionalImageUrl(index, e.target.value)}
                                                            placeholder="https://example.com/image.jpg"
                                                            className="border-2"
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
                                    <div className="flex gap-3">
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
                                            className="border-2"
                                            onClick={() => additionalImageInputRef.current?.click()}
                                        >
                                            <Upload className="mr-2 h-4 w-4" />
                                            Upload Images
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            className="border-2"
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
                        <Card className="overflow-hidden border-2 hover:border-primary/50 transition-colors duration-300 shadow-lg hover:shadow-xl">
                            <CardHeader className="bg-gradient-to-r from-blue-500/5 via-blue-500/10 to-blue-500/5 border-b">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                                        <span className="text-xl">📋</span>
                                    </div>
                                    <div>
                                        <CardTitle className="text-2xl">Specifications</CardTitle>
                                        <CardDescription className="text-base">
                                            Add or update technical specifications
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4 pt-6">
                                {specifications.map((spec, index) => (
                                    <div key={index} className="flex gap-3 items-start group">
                                        <div className="flex-1 grid grid-cols-2 gap-3">
                                            <Input
                                                value={spec.label}
                                                onChange={(e) => updateSpecification(index, "label", e.target.value)}
                                                placeholder="Specification name"
                                                className="h-11 border-2 focus-visible:border-primary"
                                            />
                                            <Input
                                                value={spec.value}
                                                onChange={(e) => updateSpecification(index, "value", e.target.value)}
                                                placeholder="Specification value"
                                                className="h-11 border-2 focus-visible:border-primary"
                                            />
                                        </div>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            className="h-11 w-11 border-2 opacity-50 group-hover:opacity-100 transition-opacity"
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
                                    className="border-2 border-dashed"
                                    onClick={addSpecification}
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Specification
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Features */}
                        <Card className="overflow-hidden border-2 hover:border-primary/50 transition-colors duration-300 shadow-lg hover:shadow-xl">
                            <CardHeader className="bg-gradient-to-r from-amber-500/5 via-amber-500/10 to-amber-500/5 border-b">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                                        <span className="text-xl">⭐</span>
                                    </div>
                                    <div>
                                        <CardTitle className="text-2xl">Features & Highlights</CardTitle>
                                        <CardDescription className="text-base">
                                            Add or update product features
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4 pt-6">
                                {features.map((feature, index) => (
                                    <div key={index} className="flex gap-3 group">
                                        <Input
                                            value={feature}
                                            onChange={(e) => updateFeature(index, e.target.value)}
                                            placeholder="Product feature"
                                            className="h-11 border-2 focus-visible:border-primary"
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            className="h-11 w-11 border-2 opacity-50 group-hover:opacity-100 transition-opacity"
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
                                    className="border-2 border-dashed"
                                    onClick={addFeature}
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Feature
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Dimensions & Weight */}
                        <Card className="overflow-hidden border-2 hover:border-primary/50 transition-colors duration-300 shadow-lg hover:shadow-xl">
                            <CardHeader className="bg-gradient-to-r from-rose-500/5 via-rose-500/10 to-rose-500/5 border-b">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-rose-500/10 flex items-center justify-center">
                                        <span className="text-xl">📏</span>
                                    </div>
                                    <div>
                                        <CardTitle className="text-2xl">Dimensions & Weight</CardTitle>
                                        <CardDescription className="text-base">
                                            Physical attributes of the product
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="grid gap-6 md:grid-cols-4 pt-6">
                                <FormField
                                    control={form.control}
                                    name="width"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-base font-semibold">Width (cm)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    step="0.1"
                                                    placeholder="0"
                                                    className="h-11 border-2 focus-visible:border-primary"
                                                    {...field}
                                                />
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
                                            <FormLabel className="text-base font-semibold">Height (cm)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    step="0.1"
                                                    placeholder="0"
                                                    className="h-11 border-2 focus-visible:border-primary"
                                                    {...field}
                                                />
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
                                            <FormLabel className="text-base font-semibold">Depth (cm)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    step="0.1"
                                                    placeholder="0"
                                                    className="h-11 border-2 focus-visible:border-primary"
                                                    {...field}
                                                />
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
                                            <FormLabel className="text-base font-semibold">Weight (kg)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    placeholder="0"
                                                    className="h-11 border-2 focus-visible:border-primary"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        {/* Tags & Keywords */}
                        <Card className="overflow-hidden border-2 hover:border-primary/50 transition-colors duration-300 shadow-lg hover:shadow-xl">
                            <CardHeader className="bg-gradient-to-r from-cyan-500/5 via-cyan-500/10 to-cyan-500/5 border-b">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                                        <span className="text-xl">🏷️</span>
                                    </div>
                                    <div>
                                        <CardTitle className="text-2xl">Tags & Keywords</CardTitle>
                                        <CardDescription className="text-base">
                                            Add tags and keywords for search optimization (press Enter, Space, or Comma to add)
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="grid gap-6 md:grid-cols-2 pt-6">
                                <div className="space-y-4">
                                    <Label className="text-base font-semibold">Tags</Label>
                                    <div className="space-y-3">
                                        <Input
                                            value={tagInput}
                                            onChange={(e) => setTagInput(e.target.value)}
                                            onKeyDown={handleTagInputKeyDown}
                                            onBlur={addTagsFromInput}
                                            placeholder="Type and press Enter, Space, or Comma"
                                            className="h-11 border-2 focus-visible:border-primary"
                                        />
                                        <div className="flex flex-wrap gap-2 min-h-[60px] p-4 border-2 border-dashed rounded-xl bg-muted/20">
                                            {tags.length === 0 && (
                                                <span className="text-muted-foreground text-sm italic">No tags added yet</span>
                                            )}
                                            {tags.map((tag, index) => (
                                                <Badge key={index} variant="secondary" className="gap-2 text-sm py-1.5 px-3">
                                                    {tag}
                                                    <button
                                                        type="button"
                                                        onClick={() => removeTag(tag)}
                                                        className="ml-1 hover:bg-muted rounded-full transition-colors"
                                                    >
                                                        <X className="h-3.5 w-3.5" />
                                                    </button>
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <Label className="text-base font-semibold">Keywords</Label>
                                    <div className="space-y-3">
                                        <Input
                                            value={keywordInput}
                                            onChange={(e) => setKeywordInput(e.target.value)}
                                            onKeyDown={handleKeywordInputKeyDown}
                                            onBlur={addKeywordsFromInput}
                                            placeholder="Type and press Enter, Space, or Comma"
                                            className="h-11 border-2 focus-visible:border-primary"
                                        />
                                        <div className="flex flex-wrap gap-2 min-h-[60px] p-4 border-2 border-dashed rounded-xl bg-muted/20">
                                            {keywords.length === 0 && (
                                                <span className="text-muted-foreground text-sm italic">No keywords added yet</span>
                                            )}
                                            {keywords.map((keyword, index) => (
                                                <Badge key={index} variant="outline" className="gap-2 text-sm py-1.5 px-3">
                                                    {keyword}
                                                    <button
                                                        type="button"
                                                        onClick={() => removeKeyword(keyword)}
                                                        className="ml-1 hover:bg-muted rounded-full transition-colors"
                                                    >
                                                        <X className="h-3.5 w-3.5" />
                                                    </button>
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Additional Information */}
                        <Card className="overflow-hidden border-2 hover:border-primary/50 transition-colors duration-300 shadow-lg hover:shadow-xl">
                            <CardHeader className="bg-gradient-to-r from-indigo-500/5 via-indigo-500/10 to-indigo-500/5 border-b">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                                        <span className="text-xl">ℹ️</span>
                                    </div>
                                    <div>
                                        <CardTitle className="text-2xl">Additional Information</CardTitle>
                                        <CardDescription className="text-base">
                                            Warranty, returns and shipping details
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="grid gap-6 md:grid-cols-1 pt-6">
                                <FormField
                                    control={form.control}
                                    name="warranty"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-base font-semibold">Warranty</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="e.g., 1 Year Manufacturer Warranty"
                                                    className="h-11 border-2 focus-visible:border-primary"
                                                    {...field}
                                                />
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
                                            <FormLabel className="text-base font-semibold">Return Policy</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Describe the return policy"
                                                    className="min-h-[100px] border-2 focus-visible:border-primary resize-none"
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
                                            <FormLabel className="text-base font-semibold">Shipping Details</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Describe shipping information"
                                                    className="min-h-[100px] border-2 focus-visible:border-primary resize-none"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        {/* Action Buttons */}
                        <Card className="border-2 border-primary/30 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 shadow-xl">
                            <CardContent className="p-6">
                                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                                    <div className="flex items-center gap-3">
                                        <AlertCircle className="h-5 w-5 text-primary" />
                                        <p className="text-sm text-muted-foreground">
                                            Make sure all required fields are filled before updating
                                        </p>
                                    </div>
                                    <div className="flex gap-3 w-full sm:w-auto">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="flex-1 sm:flex-none h-12 border-2"
                                            asChild
                                        >
                                            <Link to="/admin/products">
                                                <X className="mr-2 h-4 w-4" />
                                                Cancel
                                            </Link>
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="flex-1 sm:flex-none h-12 px-8 text-base shadow-lg hover:shadow-xl transition-all duration-300"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                    Updating...
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="mr-2 h-5 w-5" />
                                                    Update Product
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </form>
                </Form>
            </div>
        </div>
    )
}
