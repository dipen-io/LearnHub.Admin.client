import { useState, useEffect, useRef } from "react";
import { useQuery,  useMutation, useQueryClient } from "@tanstack/react-query";
import { MessageCircleWarning, MoveLeft, Ban, CircleCheckBig } from "lucide-react";
import RequestList from "../components/Request";
import { deleteUserParmanently, getInstructors, getUsers, updateUserStatus } from "../service/user";
import Loader from "../components/Loading";
import toast from "react-hot-toast";

const normalizeUserData = (user) => ({
  id: user.id,
  name: user.fullName || "Unknown User",
  email: user.email || "No Email",
  phone: user.phoneNumber || "No Phone",
  role: user.role || "No Role",
  status: user.isActive || "status"
});

const normalizeInstructorData = (instructor) => ({
  id: instructor.id,
  name: instructor.fullName || instructor.channelName || "Unknown Instructor",
  email: instructor.email || "No Email",
  phone: instructor.phoneNumber || "No Phone",
  status: instructor.isActive || ""
});

const InstructorPage = () => {
  const [selected, setSelected] = useState("users");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showRequestPage, setShowRequestPage] = useState(false);
  const [isOpenDetils, setIsOpenDetails] = useState(false);
  const [isEditId, setIsEditId] = useState(null);
  const overlayRef = useRef(null)
  // const usersPerPage = 30;
  const usersPerPage = 5;

  const queryClient = useQueryClient();

  // Fetch users
  const {
    data: usersData,
    isLoading: usersLoading,
    isError: usersError,
    refetch: refetchUsers,
  } = useQuery({
    queryKey: ["users", selected, search, currentPage],
    queryFn: () => getUsers({ search, page: currentPage, limit: usersPerPage,
            type: selected === "students" ? "students" : "users",
            status: selected === "active" ? "active"  : selected === "inactive" ? "inactive" : ""
        }),
    // enabled: selected === "users" || selected === "students"
     enabled: ["users", "students", "active", "inactive"].includes(selected)
  });

  // Fetch instructors
  const {
    data: instructorsData,
    isLoading: instructorsLoading,
    isError: instructorsError,
    refetch: refetchInstructors,
  } = useQuery({
    queryKey: ["instructors", search, currentPage],
    queryFn: () =>
      getInstructors({ search, page: currentPage, limit: usersPerPage }),
    enabled: selected === "instructors",
  });

  // Update Status
   const { mutate: mutateUserStatus, isPending: isUpdating } = useMutation({
     mutationFn: updateUserStatus,
     onSuccess: (data) => {
       console.log("✅ Status updated:", data);
       toast.success(data.message)
       // Refetch user/instructor list after update
       queryClient.invalidateQueries(["users"]);
       queryClient.invalidateQueries(["instructors"]);
       queryClient.refetchQueries(["users"]);
       queryClient.refetchQueries(["instructors"]);
     },
     onError: (error) => {
       console.error("❌ Error updating status:", error);
     },
   });

  // DELETE USER
   const { mutate: mutateUserDelete, isPending: isDeleting } = useMutation({
     mutationFn: deleteUserParmanently,
     onSuccess: (data) => {
       console.log("✅ DELETING RESPONSE:", data);

        if(data.success){
            toast.success(data.message)
        } else if (data?.response?.statusCode === 404) {
           toast.error(data.message)
        }
       // Refetch user/instructor list after update
       queryClient.invalidateQueries(["users"]);
       queryClient.invalidateQueries(["instructors"]);
       queryClient.refetchQueries(["users"]);
       queryClient.refetchQueries(["instructors"]);
     },
     onError: (error) => {
       toast.error(error.response.data.error.message);
       console.error("❌ Error Deleting user:", error);
     },
   });

  const handleRequestClick = () => setShowRequestPage(true);
  const handleBackToUsers = () => setShowRequestPage(false);

  // Decide which data to display
  const displayData =
    selected === "instructors"
      ? instructorsData?.data?.map(normalizeInstructorData) || []
      : usersData?.data?.map(normalizeUserData) || [];

  const totalPages =
    selected === "instructors"
      ? instructorsData?.pagination?.totalPage || 1
      : usersData?.pagination?.totalPage || 1;

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handlePageClick = (pageNumber) => setCurrentPage(pageNumber);

  {/*  |____EDIT____|  */}
  {/* DELTE USERS  */}
const HandleDelete  = (userId) => {
    mutateUserDelete({ userId: userId },
        {
            onSuccess: () => {
                setIsEditId(null);
            }
        }
    )
}

  {/* UPDATE STATUS  */}
  const HandleStatus = (user) => {
        const newStatus = user.status === true ? "inactive" : "active";
        mutateUserStatus(
            {status: newStatus, userId: user.id},
            {
                onSuccess: () => {
                    setIsEditId(null);
                },
            }
        )
  };

  useEffect(() => {
    if (showRequestPage) {
        setIsOpenDetails(false);
    }
    function handleClickOutside(e) {
        if (overlayRef.current && !overlayRef.current.contains(e.target)) {
           setIsEditId(null);
        }
    }

     if (isEditId) {
          document.addEventListener("mousedown", handleClickOutside);
     } else {
          document.removeEventListener("mousedown", handleClickOutside);
     }

    return () => document.removeEventListener("mousedown", handleClickOutside);

  }, [showRequestPage, isEditId])

  if (showRequestPage) {
    return (
      <div className="w-full bg-blue-100 dark:bg-blue-950 text-black dark:text-white p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">
            Incoming Requests for Instructor
          </h1>
          <button
            onClick={handleBackToUsers}
            className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800"
          >
            <MoveLeft />
          </button>
        </div>
        <RequestList />
      </div>
    );
  }


  const isLoading =
    selected === "instructors" ? instructorsLoading : usersLoading;
  const isError = selected === "instructors" ? instructorsError : usersError;
  const refetch = selected === "instructors" ? refetchInstructors : refetchUsers;

  return (
    <div className="w-full">
      <div className="md:px-10 md:py-7 py-4 px-13 ">
        <h1 className="font-bold md:text-2xl">
          {selected === "instructors" ? "Instructors List" : "Users List"}
        </h1>
        <h1 className="h-0.5 bg-blue-700"></h1>
      </div>

        <div className="text-center mb-7 relative">
          {/* 🔴 Notification Icon */}
          <div
            id="dropdownHoverButton"
            className="absolute top-3 left-4 md:left-10 cursor-pointer"
            onClick={handleRequestClick}
            onMouseEnter={() => setIsOpenDetails(true)}
            onMouseLeave={() => setIsOpenDetails(false)}
          >
            <MessageCircleWarning
              size={35}
              className="bg-red-400 dark:bg-blue-950 rounded-full"
            />
            {isOpenDetils && (
              <div
                id="dropdownHover"
                className="absolute z-10 mt-5 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 h-9 dark:bg-gray-700 py-1 text-sm"
              >
                Request Incoming
              </div>
            )}
          </div>

        <div className="relative mb-7 flex flex-col items-center text-center">
          {/* 🔴 Notification Icon */}
          <div
            id="dropdownHoverButton"
            className="absolute top-3 left-4 md:left-10 cursor-pointer"
            onClick={handleRequestClick}
            onMouseEnter={() => setIsOpenDetails(true)}
            onMouseLeave={() => setIsOpenDetails(false)}
          >
            <MessageCircleWarning
              size={35}
              className="bg-red-400 dark:bg-blue-950 rounded-full"
            />
            {isOpenDetils && (
              <div
                id="dropdownHover"
                className="absolute z-10 mt-5 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 h-9 dark:bg-gray-700 py-1 text-sm"
              >
                Request Incoming
              </div>
            )}
          </div>

          {/* 🟣 Responsive Select + Input */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-12 md:mt-0 w-full px-4">
            <select
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
              className="w-full sm:w-1/2 md:w-auto shadow-md dark:bg-blue-700 dark:shadow-amber-950 hover:shadow-fuchsia-950 rounded-md border border-blue-500  px-6 py-2 md:py-3 bg-white text-lg md:text-xl"
            >
              {["users", "students", "instructors", "inactive", "active"].map((option) => (
                <option key={option} value={option.toLowerCase()}>
                  {option}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="search here ..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="shadow-md w-full md:w-1/2 py-3 bg-white rounded-2xl px-6 dark:text-black placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </div>
        </div>

      {isLoading ? (
         <div className="fixed inset-0 flex justify-center items-center bg-white/70 dark:bg-black/30 z-50">
            <Loader />
          </div>
      ) : isError ? (
        <div className="text-center text-red-500">
          Failed to fetch {selected}.
          <button
            className="ml-2 underline text-blue-600"
            onClick={() => refetch()}
          >
            Retry
          </button>
        </div>
      ) : displayData.length > 0 ? (
        <div className="grid min-[410px]:grid-cols-2 grid-cols-1 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 px-4 md:px-10" >
          {displayData.map((user) => (
        <div
          key={user.id}
          className="w-full p-1 sm:p-2 md:p-4 relative shadow-md rounded-md border dark:border-gray-700
             transition-transform transform hover:scale-105 hover:shadow-lg bg-white dark:bg-gray-900"
          onClick={() => {
               setIsEditId(user.id)
           }} >

            {isEditId === user.id && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-800/20  rounded-md backdrop-blur-[1px]"
          onClick={(e) => {
              if (e.target === e.currentTarget) setIsEditId(null);
            }}
                                            >
          <section className="space-y-1 bg-white dark:bg-blue-300 p-2 rounded-md shadow-lg text-black"
            ref={overlayRef} >
              <p className="px-5 py-1 hover:bg-slate-200 rounded" onClick={() => HandleDelete(user.id)}> delete </p>
              <p className="px-5 py-1 hover:bg-slate-200 rounded" onClick={ () => HandleStatus(user)}>  { user.status === true ? "inactive" : "active"} </p>
                  </section>
                 </div>
                 )
               }
              <span className="absolute top-1 right-1 hidden md:block">
                 { user.status === true ? <CircleCheckBig /> :<> {<Ban className="text-red-700"/>} </> }
              </span>
              <p className="text-base">{user.name}</p>
              <p className="text-base">{user.email}</p>
              <p className="text-base">{user.phone}</p>
              <p className="text-base">{user.role}</p>
              {/* <p className="text-base">status: {user.status===true ? "active" : "inactive"}</p> */}
            </div>
          ))}
        </div>
      ): (
         <div className="text-center text-gray-500">
            No {selected} found.
          </div>
      )}

      {/* Pagination Controls */}
      {displayData.length > 0 && (
        <div className="flex justify-center items-center mt-8 space-x-4">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => handlePageClick(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1
                  ? "bg-blue-700 text-white"
                  : "bg-gray-200 dark:bg-gray-600 dark:text-white"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
   </div>
  );
};

export default InstructorPage;
