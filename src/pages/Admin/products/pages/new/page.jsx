import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ArrowLeft, Plus, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { api } from "@/utils/api";
import axios from "axios";
import { toast } from "sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import BasicInformationSection from "./sections/basic-information";
import PricingInventorySection from "./sections/pricing-inventory";
import ImagesSection from "./sections/images";
import SpecificationsSection from "./sections/specifications";
import FeaturesSection from "./sections/features";
import DimensionsWeightSection from "./sections/dimensions-weight";
import TagsKeywordsSection from "./sections/tags-keywords";
import AdditionalInformationSection from "./sections/additional-information";

const defaultCategories = [];

// Cloudinary configuration - update these with your credentials
const CLOUDINARY_UPLOAD_PRESET = "products"; // Replace with your upload preset
const CLOUDINARY_CLOUD_NAME = "drv6qpv56";
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

export default function NewProductPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [specifications, setSpecifications] = useState([
    { label: "", value: "" },
  ]);
  const [features, setFeatures] = useState([""]);
  const [tags, setTags] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [keywordInput, setKeywordInput] = useState("");

  // Image states
  const [thumbnail, setThumbnail] = useState({
    url: "",
    file: null,
    preview: "",
  });
  const [additionalImages, setAdditionalImages] = useState([]);

  // Category combobox states
  const [categories, setCategories] = useState(defaultCategories);
  const [categoryOpen, setCategoryOpen] = useState(false);

  const thumbnailInputRef = useRef(null);
  const additionalImageInputRef = useRef(null);

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
  });

  useEffect(() => {
    // load all inputs values from local storage on mount early stored if found
    if (localStorage.getItem("newProductForm")) {
      const savedValues = JSON.parse(localStorage.getItem("newProductForm"));
      form.reset(savedValues);
    }
    // save all inputs values to local storage on change
    const subscription = form.watch((value) => {
      localStorage.setItem("newProductForm", JSON.stringify(value));
    });

    return () => subscription.unsubscribe();
  }, [form]);

  const loadCategories = async () => {
    try {
      const response = await api.client.get(api.categories());
      console.log(response.data);
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
    }
  };

  // Prevent form submission on Enter key
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && e.target.tagName !== "TEXTAREA") {
      e.preventDefault();
    }
  };

  const addSpecification = () => {
    setSpecifications([...specifications, { label: "", value: "" }]);
  };

  const removeSpecification = (index) => {
    setSpecifications(specifications.filter((_, i) => i !== index));
  };

  const updateSpecification = (index, field, value) => {
    const updated = [...specifications];
    updated[index][field] = value;
    setSpecifications(updated);
  };

  const addFeature = () => {
    setFeatures([...features, ""]);
  };

  const removeFeature = (index) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const updateFeature = (index, value) => {
    const updated = [...features];
    updated[index] = value;
    setFeatures(updated);
  };

  // Tag handling
  const handleTagInputKeyDown = (e) => {
    if (e.key === "Enter" || e.key === "," || e.key === " ") {
      e.preventDefault();
      addTagsFromInput();
    }
  };

  const addTagsFromInput = () => {
    const newTags = tagInput
      .split(/[,\s]+/)
      .map((t) => t.trim())
      .filter((t) => t && !tags.includes(t));
    if (newTags.length > 0) {
      setTags([...tags, ...newTags]);
    }
    setTagInput("");
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  // Keyword handling
  const handleKeywordInputKeyDown = (e) => {
    if (e.key === "Enter" || e.key === "," || e.key === " ") {
      e.preventDefault();
      addKeywordsFromInput();
    }
  };

  const addKeywordsFromInput = () => {
    const newKeywords = keywordInput
      .split(/[,\s]+/)
      .map((k) => k.trim())
      .filter((k) => k && !keywords.includes(k));
    if (newKeywords.length > 0) {
      setKeywords([...keywords, ...newKeywords]);
    }
    setKeywordInput("");
  };

  const removeKeyword = (keywordToRemove) => {
    setKeywords(keywords.filter((k) => k !== keywordToRemove));
  };

  // Image handling
  const handleThumbnailFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setThumbnail({ url: "", file, preview, status: "uploading" });
    }
  };

  const handleThumbnailUrlChange = (url) => {
    setThumbnail({ url, file: null, preview: url, status: "uploaded" });
  };

  const handleAdditionalImageFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      url: "",
      file,
      preview: URL.createObjectURL(file),
      meta: { name: file.name, size: file.size, type: file.type },
    }));
    setAdditionalImages([...additionalImages, ...newImages]);
  };

  const addAdditionalImageUrl = () => {
    setAdditionalImages([
      ...additionalImages,
      {
        url: "",
        file: null,
        preview: "",
        meta: { name: "", size: 0, type: "" },
      },
    ]);
  };

  const updateAdditionalImageUrl = (index, url, confirm = false) => {
    const updated = [...additionalImages];
    updated[index] = {
      url,
      file: null,
      preview: confirm ? url : null,
      meta: { name: "", size: 0, type: "" },
    };
    setAdditionalImages(updated);
  };

  const removeAdditionalImage = (index) => {
    const updated = [...additionalImages];
    if (updated[index].preview && updated[index].file) {
      URL.revokeObjectURL(updated[index].preview);
    }
    updated.splice(index, 1);
    setAdditionalImages(updated);
  };

  // Upload image to Cloudinary
  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    const response = await axios.post(CLOUDINARY_UPLOAD_URL, formData);
    return response.data.secure_url;
  };

  // Add new category
  const addNewCategory = async (newCategory) => {
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // Upload thumbnail if it's a file
      let thumbnailUrl = thumbnail.url;
      if (thumbnail.file) {
        thumbnailUrl = await uploadToCloudinary(thumbnail.file);
      }

      // Upload additional images
      const imageUrls = await Promise.all(
        additionalImages.map(async (img) => {
          if (img.file) {
            return await uploadToCloudinary(img.file);
          }
          return img.url;
        }),
      );

      const productData = {
        ...data,
        thumbnail: thumbnailUrl,
        specifications: specifications.filter((s) => s.label && s.value),
        features: features.filter((f) => f.trim() !== ""),
        images: imageUrls.filter((i) => i && i.trim() !== ""),
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
      };

      // Remove individual dimension fields
      delete productData.width;
      delete productData.height;
      delete productData.depth;

      await api.client
        .post(
          api.products(
            "new/" +
              (form.getValues("id") ||
                data.id ||
                Math.floor(Math.random() * 1000000)),
          ),
          productData,
        )
        .then((response) => {
          if (response.status === 200) {
            toast.success("Product created successfully!");
            localStorage.removeItem("newProductForm");
            navigate("/auth/admin/products");
          } else {
            toast.error(response.data.message || "Failed to create product");
          }
        })
        .catch((error) => {
          toast.error(
            error.response?.data?.message || "Failed to create product",
          );
          console.error("Error creating product:", error);
        });
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error(error.response?.data?.message || "Failed to create product");
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          onKeyDown={handleKeyDown}
          className="space-y-6"
        >
          <Accordion
            defaultValue={["basic"]}
            type="single"
            className="space-y-4"
          >
            {/* Basic Information */}
            <AccordionItem value="basic">
              <AccordionTrigger>Basic Information</AccordionTrigger>
              <AccordionContent>
                <BasicInformationSection
                  form={form}
                  categories={categories}
                  categoryOpen={categoryOpen}
                  setCategoryOpen={setCategoryOpen}
                  addNewCategory={addNewCategory}
                  loadCategories={loadCategories}
                />
              </AccordionContent>
            </AccordionItem>

            {/* Pricing & Inventory */}
            <AccordionItem value="pricing">
              <AccordionTrigger>Pricing & Inventory</AccordionTrigger>
              <AccordionContent>
                <PricingInventorySection form={form} />
              </AccordionContent>
            </AccordionItem>

            {/* Images */}
            <AccordionItem value="Images">
              <AccordionTrigger>Images</AccordionTrigger>
              <AccordionContent>
                <ImagesSection
                  thumbnail={thumbnail}
                  setThumbnail={setThumbnail}
                  handleThumbnailUrlChange={handleThumbnailUrlChange}
                  handleThumbnailFileChange={handleThumbnailFileChange}
                  thumbnailInputRef={thumbnailInputRef}
                  additionalImages={additionalImages}
                  removeAdditionalImage={removeAdditionalImage}
                  updateAdditionalImageUrl={updateAdditionalImageUrl}
                  handleAdditionalImageFileChange={
                    handleAdditionalImageFileChange
                  }
                  additionalImageInputRef={additionalImageInputRef}
                  addAdditionalImageUrl={addAdditionalImageUrl}
                />
              </AccordionContent>
            </AccordionItem>

            {/* Specifications */}
            <AccordionItem value="specifications">
              <AccordionTrigger>Specifications</AccordionTrigger>
              <AccordionContent>
                <SpecificationsSection
                  specifications={specifications}
                  updateSpecification={updateSpecification}
                  removeSpecification={removeSpecification}
                  addSpecification={addSpecification}
                />
              </AccordionContent>
            </AccordionItem>

            {/* Features */}
            <AccordionItem value="features">
              <AccordionTrigger>Features</AccordionTrigger>
              <AccordionContent>
                <FeaturesSection
                  features={features}
                  updateFeature={updateFeature}
                  removeFeature={removeFeature}
                  addFeature={addFeature}
                />
              </AccordionContent>
            </AccordionItem>

            {/* Dimensions & Weight */}
            <AccordionItem value="dimensions-weight">
              <AccordionTrigger>Dimensions & Weight</AccordionTrigger>
              <AccordionContent>
                <DimensionsWeightSection form={form} />
              </AccordionContent>
            </AccordionItem>

            {/* Tags & Keywords */}
            <AccordionItem value="tags-keywords">
              <AccordionTrigger>Tags & Keywords</AccordionTrigger>
              <AccordionContent>
                <TagsKeywordsSection
                  tagInput={tagInput}
                  setTagInput={setTagInput}
                  handleTagInputKeyDown={handleTagInputKeyDown}
                  addTagsFromInput={addTagsFromInput}
                  tags={tags}
                  removeTag={removeTag}
                  keywordInput={keywordInput}
                  setKeywordInput={setKeywordInput}
                  handleKeywordInputKeyDown={handleKeywordInputKeyDown}
                  addKeywordsFromInput={addKeywordsFromInput}
                  keywords={keywords}
                  removeKeyword={removeKeyword}
                />
              </AccordionContent>
            </AccordionItem>

            {/* Additional Information */}
            <AccordionItem value="additional-information">
              <AccordionTrigger>Additional Information</AccordionTrigger>
              <AccordionContent>
                <AdditionalInformationSection form={form} />
              </AccordionContent>
            </AccordionItem>

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
          </Accordion>
        </form>
      </Form>
    </div>
  );
}
