import { useState } from 'react';
import toast from 'react-hot-toast';
import { RemoveCategory, CreateCategory, GetCategory } from "../service/category";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import Loader from "../components/Loading"
import { ChevronLeft, ChevronRight } from 'lucide-react';

const RenderCategory = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(45);
  const [query, setQuery] = useState("");
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
    queryKey: ["categories", query, page, limit],
    queryFn: () => GetCategory(query, page, limit),
    // select: (responseData) => responseData.data,
    keepPreviousData: true,
  });

  // Mutation for creating category
  const { mutate: createCategory, isPending: isCreatingCategory, error: createError } = useMutation({
    mutationFn: CreateCategory,
    onSuccess: () => {
      toast.success("Category created successfully!");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setIsCreating(false);
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
    const Category = categories?.data || [];
    const totalItems = categories?.total || 0;
    const currentPage = categories?.page || 1;

    const totalPage = Math.ceil(totalItems / limit);
    const hasNextPage = currentPage < totalPage;
    const hasPrevPage = currentPage > 1;

    const handleNext = () => {
        if (hasNextPage) {
            setPage(currentPage + 1);
        }
    };

    const handlePrev = () => {
        if (hasPrevPage) {
            setPage(currentPage - 1);
        }
    };

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
      toast.error("Category name and slug are required.");
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
        <>
    <div className="px-4 sm:px-8 md:px-16 lg:px-24 pt-10">

        {/*  Search Bar */}
        <div className='w-full text-center my-5'>
            <input type="text" placeholder='search category'
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className='shadow-xl bg-white text-black w-full md:w-1/2 py-2 px-5 dark:bg-slate-100 placeholder:text-slate-400  rounded-2xl text-xl '/>
        </div>

      {/* Category list */}
      {isCategoryLoading && <div className='flex items-center w-full h-[400px] justify-center'><Loader /> </div>}

      {/* ✅ FIX: Moved categoryError to the list view where it belongs */}
      {categoryError && <p className="text-red-600">Failed to load categories.</p>}

      {!isCategoryLoading && !categoryError && (
        <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
            {Category?.map((cat) => (
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
                  className="
                    max-w-0 opacity-0 overflow-hidden
                    group-hover:max-w-full group-hover:opacity-100
                    ml-3 px-3 py-1 rounded-md  border border-white
                    hover:text-black hover:bg-white transition-all duration-200
                    disabled:opacity-50 font-semibold
                  "
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            ))}
        </div>
      )}

      {/* Button */}
     {!isCategoryLoading  && (
      <div className="mt-3 flex justify-center sm:justify-start">
        <button
          onClick={handleAddCategoryClick}
          className="py-2 px-4 rounded-md bg-white text-blue-800 border border-blue-400
                     hover:bg-blue-600 hover:text-white  dark:text-white
                            dark:bg-gray-800
                     transition-all duration-200 hover:shadow hover:shadow-blue-900 font-semibold">
          + Create Category
        </button>
      </div>
       )}
    </div>

      {/* Pagination */}
    <div className="py-4 md:mt-10 flex md:mx-30 justify-center md:justify-end items-center gap-6">
        <span className="text-gray-600 dark:text-gray-400">
          Page {currentPage} of {totalPage}
        </span>
        <button
          onClick={handlePrev}
          disabled={!hasPrevPage || isCategoryLoading}
          className="disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={30} />
        </button>
        <button
          onClick={handleNext}
          disabled={!hasNextPage || isCategoryLoading}
          className="disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight size={30} />
        </button>
      </div>
  </>
  );
};

export default RenderCategory;
