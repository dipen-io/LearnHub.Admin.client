import { useState } from 'react';
import toast from 'react-hot-toast';
import { RemoveCategory, CreateCategory, GetCategory } from "../service/category";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

const RenderCategory = () => {
  const [category, setCategory] = useState({
    name: "",
    slug: "",
    description: "",
  });
  const [isCreating, setIsCreating] = useState(false);
  const queryClient = useQueryClient();

  // -------------------
  // DATA FETCHING (React Query)
  // -------------------

  // Fetch categories
  const { data: categories, isLoading: isCategoryLoading, error: categoryError } = useQuery({
    queryKey: ["categories"],
    queryFn: GetCategory,
    select: (responseData) => responseData.data,
  });

  // Mutation for creating category
  const { mutate: createCategory, isPending: isCreatingCategory, error: createError } = useMutation({
    mutationFn: CreateCategory,
    onSuccess: () => {
      toast.success("Category created successfully!");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setIsCreating(false); // Go back to the list view after success
      setCategory({ name: "", slug: "", description: "" }); // clear form
    },
    onError: (err) => {
      toast.error(err.message || "Failed to create category");
    }
  });

    // Mutation for deleting category
    const { mutate: deleteCategory, isPending: isDeleting } = useMutation({
      mutationFn: RemoveCategory,
      onSuccess: () => {
        toast.success("Category deleted successfully!");
        queryClient.invalidateQueries({ queryKey: ["categories"] });
      },
      onError: (err) => {
        toast.error(err.message || "Failed to delete category");
      },
    });

  // -------------------
  // HANDLERS
  // -------------------

  const handleChange = (e) => {
    setCategory({
      ...category,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddCategoryClick = () => {
    setIsCreating(true);
  };

  const handleCancelClick = () => {
    setIsCreating(false);
    setCategory({ name: "", slug: "", description: "" });
    // ✅ FIX: Removed setError("") as it didn't exist
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Good practice for forms
    if (!category.name || !category.slug) {
      toast.error("Category name and slug are required."); // ✨ ENHANCEMENT: Show validation error
      return;
    }
    createCategory(category);
  };


    const handleDelete = (id) => {
        if (window.confirm("Are u sure want to delte this category?")) {
            deleteCategory(id);
        }
    }

  // -------------------
  // RENDER: CREATE VIEW
  // -------------------

  if (isCreating) {
    return (
      <form onSubmit={handleSubmit} className="px-4 sm:px-8 md:px-16 lg:px-24 mt-10">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Create New Category
        </h1>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
          <input
            type="text"
            name="name"
            value={category.name}
            onChange={handleChange}
            placeholder="Enter Category Name"
            className="py-2 px-4 w-full sm:w-1/3 border border-gray-300 rounded-md focus:ring focus:ring-blue-200 placeholder:text-slate-500"
          />
          <input
            type="text"
            name="slug"
            value={category.slug}
            onChange={handleChange}
            placeholder="Enter Slug"
            className="py-2 px-4 w-full sm:w-1/3 border border-gray-300 rounded-md focus:ring focus:ring-blue-200 placeholder:text-slate-500"
          />
          <input
            type="text"
            name="description"
            value={category.description}
            onChange={handleChange}
            placeholder="Enter Description"
            className="py-2 px-4 w-full sm:w-1/3 border border-gray-300 rounded-md focus:ring focus:ring-blue-200 placeholder:text-slate-500"
          />
        </div>

        <div className="flex gap-4 justify-center">
          <button
            type="button" // Prevent form submit
            onClick={handleCancelClick} // ✅ FIX: This now correctly hides the view
            disabled={isCreatingCategory} // ✅ FIX: Was 'loading', should be 'isCreatingCategory'
            className="mt-2 py-2 px-6 rounded-md text-red-800 border border-red-400
                       hover:bg-red-600 hover:text-white transition-all duration-200 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isCreatingCategory}
            className="mt-2 py-2 px-6 rounded-md text-green-800 border border-green-400
                       hover:bg-green-700 hover:text-white transition-all duration-200 disabled:opacity-50"
          >
            {isCreatingCategory ? "Creating..." : "Submit"}
          </button>
        </div>

        {/* Error message (only shows create errors) */}
        {createError && (
          <p className="text-center text-red-600 mt-4">
            {createError.message || "Failed to create category"}
          </p>
        )}
      </form>
    );
  }

  // -------------------
  // RENDER: LIST VIEW
  // -------------------

  return (
    <div className="px-4 sm:px-8 md:px-16 lg:px-24 py-10">
      {/* Category list */}
      {isCategoryLoading && <p>Loading categories...</p>}

      {/* ✅ FIX: Moved categoryError to the list view where it belongs */}
      {categoryError && <p className="text-red-600">Failed to load categories.</p>}

      {!isCategoryLoading && !categoryError && (
        <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
          {/* ✅ FIX: Changed ul/li back to divs for horizontal layout */}
        {categories?.map((cat) => (
          <div
            key={cat.id}
            className="group flex items-center justify-between text-blue-800 dark:text-white
                       bg-white dark:bg-gray-800 py-1 px-4 rounded-md border border-blue-400
                       transition-all duration-200 ease-in-out hover:bg-blue-600 hover:text-white
                       hover:shadow hover:shadow-blue-900 w-full sm:w-auto"
          >
             <Link to={`/category/${cat.id}`}>
                <div className="flex items-center gap-3 transition-all duration-200">
                  <strong>{cat.name}</strong>
                </div>
             </Link>

            {/* delete button — appears smoothly */}
            <button
              onClick={() => handleDelete(cat.id)}
              disabled={isDeleting}
              className="opacity-0 group-hover:opacity-100 ml-3 px-3 py-1 rounded-md  border border-white
                          hover:text-black hover:bg-white transition-all duration-200 disabled:opacity-50 font-semibold"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        ))}
        </div>
      )}

      {/* Button */}
      <div className="mt-6 flex justify-center sm:justify-start">
        <button
          onClick={handleAddCategoryClick}
          className="py-2 px-4 rounded-md text-blue-800 border border-blue-400
                     hover:bg-blue-600 hover:text-white dark:text-white
                     transition-all duration-200 hover:shadow hover:shadow-blue-900">
          + Create Category
        </button>
      </div>
    </div>
  );
};

export default RenderCategory;
