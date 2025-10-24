import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { X, Check } from "lucide-react"
import { GetRequest, AcceptRequest } from "../service/user";
import { useState, useEffect } from "react";

const RequestList = () => {
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const { mutate, isLoading, data, isError, error } = useMutation({
    mutationFn: GetRequest,
    onSuccess: (response) => {
      // toast.success(response.message);
    },
    onError: (error) => {
      if (!error.response) {
        toast.error("Network error. Please try again later.");
        return;
      }

      //ERROR HERE
      const err = error?.response?.data?.error;
      console.log("ERR ERR : ", err);
      if (err?.statusCode === 404) {
        setEmailError(err.message);
      }
      if (err?.statusCode === 401) {
        setPasswordError(err.message);
      }
      // toast.error(err?.message || "Request fetching failed");
    },
  });

  useEffect(() => {
    mutate(); // Trigger the mutation when the component mounts
  }, [mutate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

    const handleReject = () => {
        alert("Reject")
    }

    const handleAccept = async(id) => {
        const response = await AcceptRequest(id)
        if (response.success){
            toast.success(response.message);
        } else {
            console.error("response error");
        }
    }

  return (
    <div>
      <div className="relative  hover:shadow-2xl px-3 py-3 grid-cols-5 w-1/4 rounded">
      {data && data.length > 0 ? (
        <ul>
          {data.map((request, index) => (
                            <>
            <li key={index}>
              <p>Channel Name : {request.channelName}</p>
              <p> full Name : {request.user.fullName}</p>
              <p> Email : {request.user.email || request.user.phoneNumber}</p>
              <p>User Role : {request.user.role}</p>
            </li>

              <div className="absolute right-5 top-2 space-y-4 justify-center mt-2 cursor-pointer">
                <Check size={35} className="bg-green-500 text-white rounded hover:bg-green-400"

                    onClick={() => handleAccept(request.id)}
                            />
               <X size={35} className="bg-red-500 text-white rounded hover:bg-red-400"
                                onClick={() => handleReject()}
                            />
             </div>
           </>
          ))}
        </ul>
      ) : (
        <div>No requests found</div>
      )}
      </div>
    </div>
  );
};

export default RequestList;

