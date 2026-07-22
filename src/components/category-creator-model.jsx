import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Label } from "@/components/ui/label";
import { Field, FieldGroup } from "@/components/ui/field";

import { IconPicker } from "@/components/ui/icon-picker";
import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { api } from "@/utils/api";

function CategoryCreatorModel({
  isCategoryCreateModelOpen,
  setCategoryCreateModel,
  categorySearchInputValue,
  onAddCategory,
}) {
  const [categoryName, setCategoryName] = useState("");
  const [categoryIcon, setCategoryIcon] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");

  return (
    <Dialog
      open={isCategoryCreateModelOpen}
      onOpenChange={setCategoryCreateModel}
    >
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Create Category</DialogTitle>
          <DialogDescription>Add a new category to the list</DialogDescription>
        </DialogHeader>
        <FieldGroup>
          <Field>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              defaultValue={categorySearchInputValue}
              onChange={(e) => setCategoryName(e.target.value)}
            />
          </Field>
          <Field>
            <Label htmlFor="icon">Icon</Label>
            <IconPicker
              className="z-[400]"
              zIndex={400}
              categorized={false}
              onValueChange={(value) => setCategoryIcon(value)}
            />
          </Field>
          <Field>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              name="description"
              defaultValue=""
              onChange={(e) => setCategoryDescription(e.target.value)}
              type="textarea"
            />
          </Field>
        </FieldGroup>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Cancel</Button>} />
          <Button
            type="submit"
            onClick={() => {
              toast
                .promise(
                  new Promise((resolveui, rejectui) => {
                    if (
                      !categoryName ||
                      !categoryIcon ||
                      !categoryDescription
                    ) {
                      rejectui(new Error("Please fill in all fields"));
                      return;
                    }

                    api.client
                      .post(api.categories(), {
                        name: categoryName,
                        icon: categoryIcon,
                        id: categoryName.toLowerCase().replace(/\s+/g, "-"),
                        logo: "",
                        description: categoryDescription,
                      })
                      .then((response) => {
                        if (response.status === 201) {
                          resolveui(response);
                        } else {
                          rejectui(new Error("Failed to create category"));
                        }
                      });
                  }),
                  {
                    loading: "Creating category...",
                    success: "Category created successfully",
                    error: "Failed to create category",
                  },
                )
                .then(() => {
                  onAddCategory(
                    categoryName,
                    categoryIcon,
                    categoryDescription,
                  );
                });
            }}
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CategoryCreatorModel;
