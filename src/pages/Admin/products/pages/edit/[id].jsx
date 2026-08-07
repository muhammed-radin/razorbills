import { useState, useRef, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
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
import { productSchema } from "@/utils/product_zod";
import { Skeleton } from "@/components/ui/skeleton";

const defaultCategories = [];

// Cloudinary configuration - update these with your credentials
const CLOUDINARY_UPLOAD_PRESET = "thumbs"; // Replace with your upload preset
const CLOUDINARY_CLOUD_NAME = "drv6qpv56";
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

export default function EditProductPage() {
  const navigate = useNavigate();
  const id = useParams().id; // Get the product ID from the URL params if needed
  const [loadedProduct, setLoadedProduct] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
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
    isThumbnail: true,
  });
  const [additionalImages, setAdditionalImages] = useState([]);

  function fetchProduct() {
    api.client
      .get(api.products(id))
      .then((response) => {
        if (response.status === 200) {
          const product = response.data;
          form.reset({
            id: product.id,
            title: product.title,
            price: product.price,
            originalPrice: product.originalPrice,
            thumbnail: product.thumbnail,
            description: product.description,
            category: product.category,
            stock: product.stock,
            brand: product.brand,
            tax: product.tax,
            detailedDescription: product.detailedDescription,
            rating: product.rating,
            reviewCount: product.reviewCount,
            width: product.dimensions?.width || 0,
            height: product.dimensions?.height || 0,
            depth: product.dimensions?.depth || 0,
            weight: product.weight || 0,
            isActive: product.isActive,
            currency: product.currency || "INR",
            warranty: product.warranty || "",
            returnPolicy: product.returnPolicy || "",
            shippingDetails: product.shippingDetails || "",
            sku: product.sku || "",
          });
          setSpecifications(product.specifications || []);
          setFeatures(product.features || []);
          setTags(product.tags || []);
          setKeywords(product.keywords || []);
          setThumbnail({
            url: product.thumbnail,
            file: null,
            preview: product.thumbnail,
            isThumbnail: true,
          });
          setAdditionalImages(
            (product.images || []).map((img, index) => ({
              url: img,
              file: null,
              preview: img,
              meta: { name: "Image " + index, size: 0, type: "" },
            })),
          );
          setLoadedProduct(product);
        } else {
          toast.error(response.data.message || "Failed to load product");
        }
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || "Failed to load product");
        console.error("Error loading product:", error);
      });
  }

  useEffect(() => {
    setTimeout(() => {
      fetchProduct();
    }, 1000);
  }, [id]);

  // save images into indexedDB ( stores thumbnail and additional images with blob and url ).
  function saveImages() {
    let saveData = { data: [thumbnail, ...additionalImages], id: 0 };

    if (saveData.data.length === 0) {
      return;
    }
    // store in indexedDB
    const request = indexedDB.open("editProductImagesDB", 1);
    request.onupgradeneeded = function (event) {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("images")) {
        db.createObjectStore("images", { keyPath: "id", autoIncrement: true });
      }
    };
    request.onsuccess = function (event) {
      const db = event.target.result;
      const transaction = db.transaction("images", "readwrite");
      const store = transaction.objectStore("images");
      // saveData.forEach((image, index) => {
      //   image.id = index; // Assign a unique ID for each image
      //   // store.put(image);
      // });
      store.put(saveData);
    };
    request.onerror = function (event) {
      console.error("IndexedDB error:", event.target.error);
      toast.warning("Failed to save images to DB");
    };
  }

  function loadImages() {
    const request = indexedDB.open("editProductImagesDB", 1);
    request.onsuccess = function (event) {
      const db = event.target.result;
      const transaction = db.transaction("images", "readonly");
      const store = transaction.objectStore("images");
      const getAllRequest = store.getAll();
      getAllRequest.onsuccess = function (event) {
        const images = event.target.result;
        if (images.length > 0) {
          if (images[0].data[0].isThumbnail) {
            setThumbnail(images[0].data[0]);
          }
          if (thumbnail.file) {
            thumbnail.preview = URL.createObjectURL(thumbnail.file);
          }

          let imagesData = images[0].data.slice(1);
          imagesData.forEach((image) => {
            if (image.file) {
              image.preview = URL.createObjectURL(image.file);
            }
          });
          setAdditionalImages(imagesData);
        } else {
          console.log("No images found in DB");
        }
      };
    };
    request.onerror = function (event) {
      console.error("IndexedDB error:", event.target.error);
      toast.warning("Failed to load images from DB");
    };
  }

  function clearImages() {
    const request = indexedDB.open("editProductImagesDB", 1);
    request.onsuccess = function (event) {
      const db = event.target.result;
      const transaction = db.transaction("images", "readwrite");
      const store = transaction.objectStore("images");
      const clearRequest = store.clear();
      clearRequest.onsuccess = function () {
        console.log("Cleared images from DB");
      };
      clearRequest.onerror = function (event) {
        console.error("IndexedDB error:", event.target.error);
        toast.warning("Failed to clear images from DB");
      };
    };
    request.onerror = function (event) {
      console.error("IndexedDB error:", event.target.error);
      toast.warning("Failed to open DB for clearing images");
    };
  }

  const firstLoadRef = useRef(true);
  useEffect(() => {
    if (!(thumbnail.url || thumbnail.file) && !additionalImages.length > 0) {
      if (firstLoadRef.current) {
        loadImages();
        firstLoadRef.current = false;
      }
    }
    saveImages();
  }, [thumbnail, additionalImages]);

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
      rating: 0,
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
    if (localStorage.getItem("editProductForm")) {
      const savedValues = JSON.parse(localStorage.getItem("editProductForm"));
      form.reset(savedValues);
    }
    // save all inputs values to local storage on change
    const subscription = form.watch((value) => {
      let saveData = { ...value };
      localStorage.setItem("editProductForm", JSON.stringify(saveData));
    });

    return () => subscription.unsubscribe();
  }, [form]);

  const isLoadedFromLocalStorageRef = useRef(false);

  const clearLocalStorage = () => {
    localStorage.removeItem("editProductForm");
    localStorage.removeItem("editArrayDataForm");
  };

  useEffect(() => {
    if (
      localStorage.getItem("editArrayDataForm") &&
      !isLoadedFromLocalStorageRef.current
    ) {
      const savedValues = JSON.parse(localStorage.getItem("editArrayDataForm"));
      setSpecifications(savedValues.specifications);
      setFeatures(savedValues.features);
      setTags(savedValues.tags);
      setKeywords(savedValues.keywords);
      isLoadedFromLocalStorageRef.current = true;
    }

    if (
      specifications.length > 0 ||
      features.length > 0 ||
      tags.length > 0 ||
      keywords.length > 0
    ) {
      let arrData = {
        specifications: specifications,
        features: features,
        tags: tags,
        keywords: keywords,
      };
      localStorage.setItem("editArrayDataForm", JSON.stringify(arrData));
    }
  }, [specifications, features, tags, keywords]);

  const loadCategories = async () => {
    try {
      const response = await api.client.get(api.categories());
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
      setThumbnail({
        url: "",
        file,
        preview,
        status: "uploading",
        isThumbnail: true,
      });
    }
  };

  const handleThumbnailUrlChange = (url) => {
    setThumbnail({
      url,
      file: null,
      preview: url,
      status: "uploaded",
      isThumbnail: true,
    });
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
  const uploadToCloudinary = (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    return new Promise((resolve, reject) => {
      toast.promise(
        () =>
          new Promise((resolveui, rejectui) => {
            const xhr = new XMLHttpRequest();
            xhr.open("POST", CLOUDINARY_UPLOAD_URL);
            xhr.upload.onprogress = (e) => {
              const progress = Math.round((e.loaded / e.total) * 100);
              setUploadProgress(progress);
            };
            xhr.onload = () => {
              if (xhr.status === 200) {
                resolveui("Image uploaded successfully:" + file?.name);
                resolve(JSON.parse(xhr.response).secure_url);
              } else {
                rejectui(new Error("Cloudinary upload failed"));
                reject(new Error("Cloudinary upload failed"));
              }
            };
            xhr.onerror = () => {
              rejectui(new Error("Cloudinary upload failed"));
              reject(new Error("Cloudinary upload failed"));
            };
            xhr.send(formData);
          }),
        {
          loading: "Uploading image...",
          success: "Image uploaded successfully",
          error: "Error uploading image",
        },
      );
    });
  };

  // Add new category
  const addNewCategory = async (newCategory) => {
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
    }
  };

  const validateData = function (data) {
    // validate data using zod schema
    const validatedData = productSchema.safeParse(data);
    if (!validatedData.success) {
      setIsSubmitting(false);
      toast.warning("Validation failed");
      toast.warning(
        "At " +
          JSON.parse(validatedData.error.message)[0].path +
          ", Err: " +
          JSON.parse(validatedData.error.message)[0].message,
      );
    }

    return validatedData.success;
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      // Upload thumbnail if it's a file
      let thumbnailUrl = thumbnail.url;
      if (thumbnail.file && thumbnail.url === "") {
        thumbnailUrl = await uploadToCloudinary(thumbnail.file);
        URL.revokeObjectURL(thumbnail.preview);
        thumbnail.preview = thumbnailUrl;
        thumbnail.file = null;
        thumbnail.url = thumbnailUrl;
        setThumbnail({
          ...thumbnail,
          url: thumbnailUrl,
        });
      }

      // Upload additional images
      const imageUrls = await Promise.all(
        additionalImages.map(async (img, index) => {
          if (img.file && img.url === "") {
            let uploadedUrl = await uploadToCloudinary(img.file);
            URL.revokeObjectURL(img.preview);
            img.preview = uploadedUrl;
            img.file = null;
            img.url = uploadedUrl;
            updateAdditionalImageUrl(index, uploadedUrl, true);

            return uploadedUrl;
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

      if (!validateData(productData)) {
        setIsSubmitting(false);
        return;
      }

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
            localStorage.removeItem("editProductForm");
            clearLocalStorage();
            clearImages();
            setIsSubmitting(false);
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
          <Link to="/auth/admin/products">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Product</h1>
          <p className="text-muted-foreground">
            Update your product information <strong>Product ID: {id}</strong>
          </p>
        </div>
      </div>

      {!loadedProduct ? (
        <div className="flex gap-3 flex-wrap flex-row">
          <Skeleton className="h-8 w-80 rounded-md max-sm:w-56" />
          <Skeleton className="h-8 w-80 rounded-md max-sm:w-36" />
          <Skeleton className="h-8 w-120 rounded-md max-sm:w-56" />
          <Skeleton className="h-8 w-30 rounded-md max-sm:w-36" />
          <Skeleton className="h-8 w-70 rounded-md max-sm:w-78" />
          <Skeleton className="h-8 w-25 rounded-md max-sm:w-56" />
          <Skeleton className="h-8 w-90 rounded-md max-sm:w-22" />
          <Skeleton className="h-8 w-34 rounded-md max-sm:w-56" />
          <div className="w-full">
            <Skeleton className="h-24 w-180 rounded-md max-md:w-full" />
          </div>
        </div>
      ) : (
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
                  <Link to="/auth/admin/products">Cancel</Link>
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
                      Update Product
                    </>
                  )}
                </Button>
              </div>
            </Accordion>
          </form>
        </Form>
      )}
    </div>
  );
}
