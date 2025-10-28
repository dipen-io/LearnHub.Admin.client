import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { X, Check } from "lucide-react";
import { GetRequest, AcceptRequest } from "../service/user";

const RequestList = () => {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["requests"],
    queryFn: GetRequest,
    onError: (error) => {
      if (!error.response) {
        toast.error("Network error. Please try again later.");
        return;
      }
      const err = error?.response?.data?.error;
      toast.error(err?.message || "Failed to fetch requests");
    },
  });

  const handleAccept = async (id) => {
    try {
      const response = await AcceptRequest({id, status: "accept"});
      if (response.success) {
        toast.success(response.message);
        refetch();
      } else {
        toast.error("Failed to accept request");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  const handleReject = async (id) => {
    try {
      const response = await AcceptRequest({id, status: "reject"});
      if (response.success) {
        toast.success(response.message);
        refetch();
      } else {
        toast.error("Failed to accept request");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-500 font-semibold py-10">
        Failed to load requests. Please try again.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        Instructor Requests
      </h2>

      {data && data.length > 0 ? (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.map((request) => (
            <li
              key={request.id}
              className="bg-white shadow-md hover:shadow-lg transition-all duration-300 rounded-lg p-5 border border-gray-200 flex flex-col justify-between"
            >
              <div className="space-y-1 text-gray-700">
                <p>
                  <span className="font-medium">Channel Name:</span>{" "}
                  {request.channelName}
                </p>
                <p>
                  <span className="font-medium">Full Name:</span>{" "}
                  {request.user.fullName}
                </p>
                <p>
                  <span className="font-medium">Email / Phone:</span>{" "}
                  {request.user.email || request.user.phoneNumber}
                </p>
                <p>
                  <span className="font-medium">Role:</span>{" "}
                  {request.user.role}
                </p>
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => handleAccept(request.id)}
                  className="flex items-center gap-1 bg-green-500 text-white px-3 py-2 rounded-md hover:bg-green-600 transition-colors"
                >
                  <Check size={18} /> Accept
                </button>
                <button
                  onClick={() => handleReject(request.id)}
                  className="flex items-center gap-1 bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600 transition-colors"
                >
                  <X size={18} /> Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center text-gray-500 py-10">
          No requests found.
        </div>
      )}
    </div>
  );
};

export default RequestList;

