import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { GetSingleCategory, UpdateCategory, RemoveCategory } from '../service/category';
import Loader from "../components/Loading";
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const SingleCategory = () => {
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", slug: "", description: "" });
  const queryClient = useQueryClient();
  const { id } = useParams();
  const navigate = useNavigate();

  // ✅ Fetch single category
  const { data: category, isLoading, error } = useQuery({
    queryKey: ["category", id],
    queryFn: () => GetSingleCategory(id),
    enabled: !!id,
    onSuccess: (data) => {
      setFormData({
        name: data.name || "",
        slug: data.slug || "",
        description: data.description || "",
      });
    },
  });

  // ✅ Update mutation
  const { mutate: updateCategory, isPending: isUpdating } = useMutation({
    mutationFn: UpdateCategory, // ✅ Pass function reference, not call
    onSuccess: () => {
      toast.success("Category updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["category", id] });
      setIsUpdateOpen(false);
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update category");
    },
  });

    // Mutation for deleting category
    const { mutate: deleteCategory, isPending: isDeleting } = useMutation({
        mutationFn: RemoveCategory,
        onSuccess: () => {
            toast.success("Category deleted successfully!");
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            navigate("/category");

        },
        onError: (err) => {
            toast.error(err.message || "Failed to delete category");
        },
    });

  if (isLoading) {
    return (
      <div className="flex items-center w-full justify-center">
        <Loader />
      </div>
    );
  }

  if (error) return <p className="text-red-500">Failed to load category.</p>;

  const handleUpdateToggle = () => {
    setIsUpdateOpen((prev) => !prev);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

const handleSubmit = (e) => {
  e.preventDefault();
  if (!id || !category) return;

  const changedFields = {};
  for (const key in formData) {
    if (formData[key] !== category[key]) {
      changedFields[key] = formData[key];
    }
  }

  if (Object.keys(changedFields).length === 0) {
    toast("No changes detected.");
    setIsUpdateOpen(false);
    return;
  }

  updateCategory({ id, updatedData: changedFields });
 };

   const handleDelete = () => {
       if (window.confirm("Are u sure want to delte this category?")) {
           deleteCategory(id);
       }
   }

  return (
    <div className="px-8 py-5 mt-10 w-1/3 ml-10  rounded ">
      <h1 className="text-2xl font-bold mb-2">Category Details</h1>

      {!isUpdateOpen ? (
        <>
          <p className="text-gray-700 dark:text-gray-300 mb-2">
            <strong>Name:</strong> {category.name}
          </p>
          <p className="text-gray-700 dark:text-gray-300 mb-2">
            <strong>Slug:</strong> {category.slug}
          </p>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            <strong>Description:</strong> {category.description || "No description"}
          </p>
          <div className="flex gap-5 justify-center">
            <button className="hover:font-bold rounded py-1 px-4 bg-red-500 text-white hover:bg-red-400"
              onClick={handleDelete}
              disabled={isDeleting} >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
            <button
              className="hover:font-bold rounded py-1 px-4 bg-green-400 hover:bg-green-500 text-white"
              onClick={handleUpdateToggle}
            >
              Update
            </button>
          </div>
        </>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Category Name"
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            placeholder="Slug"
            className="border p-2 rounded"
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            className="border p-2 rounded"
          />
          <div className="flex gap-4 mt-3">
            <button
              type="submit"
              disabled={isUpdating}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
            >
              {isUpdating ? "Updating..." : "Save"}
            </button>
            <button
              type="button"
              onClick={handleUpdateToggle}
              className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default SingleCategory;

