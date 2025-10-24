import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { MessageCircleWarning, MoveLeft } from "lucide-react";
import RequestList from "../components/Request";
import { getInstructors, getUsers } from "../service/user";
import Loader from "../components/Loading";

const normalizeUserData = (user) => ({
  id: user.id,
  name: user.fullName || "Unknown User",
  email: user.email || "No Email",
  phone: user.phoneNumber || "No Phone",
  role: user.role || "No Role"
});

const normalizeInstructorData = (instructor) => ({
  id: instructor.id,
  name: instructor.fullName || instructor.channelName || "Unknown Instructor",
  email: instructor.email || "No Email",
  phone: instructor.phoneNumber || "No Phone",
});

const InstructorPage = () => {
  const [selected, setSelected] = useState("users");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showRequestPage, setShowRequestPage] = useState(false);
  const [isOpenDetils, setIsOpenDetails] = useState(false);
  // const usersPerPage = 30;
  const usersPerPage = 5;

  // Fetch users
  const {
    data: usersData,
    isLoading: usersLoading,
    isError: usersError,
    refetch: refetchUsers,
  } = useQuery({
    queryKey: ["users", selected, search, currentPage],
    queryFn: () => getUsers({ search, page: currentPage, limit: usersPerPage,
            type: selected === "students" ? "students" : "users"
        }),
    enabled: selected === "users" || selected === "students",
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

  useEffect(() => {
    if (showRequestPage) {
        setIsOpenDetails(false);
    }
  }, [showRequestPage])

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
    <div className="">
      <div className="px-10 py-7">
        <h1 className="font-bold md:text-2xl">
          {selected === "instructors" ? "Instructors List" : "Users List"}
        </h1>
        <h1 className="h-0.5 bg-blue-700"></h1>
      </div>

      {/* Filter + Search */}
      <div className="text-center mb-7 relative">
        <div
          id="dropdownHoverButton"
          className="absolute top-3 cursor-pointer left-10"
          onClick={handleRequestClick}
          onMouseEnter={() => setIsOpenDetails(true)}
          onMouseLeave={() => setIsOpenDetails(false)}
        >
          <MessageCircleWarning
            size={35}
            className="bg-red-400 dark:bg-blue-950 rounded-full"
          />
          { isOpenDetils && (
            <div id="dropdownHover"
             className="absolute z-10 mt-5 bg-white divide-y divide-gray-100 rounded-lg shado             w-sm w-44 h-9 dark:bg-gray-700 py-1" >
            Request Incoming
            </div>
            )}
        </div>

        <div className="flex ml-25">
          <select
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
  className="mr-10 shadow-md dark:bg-blue-700 dark:shadow-amber-950 hover:shadow-fuchsia-950 rounded-md border border-blue-500 px-10 py-3 bg-white text-xl"
          >
            {["users", "students", "instructors"].map((option) => (
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
            className="shadow-md lg:w-1/2 w-full md:mx-0 mx-2 py-3 bg-white rounded-2xl px-5 dark:text-black
 placeholder:text-slate-400 dark:placeholder:text-slate-500"
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
        <div className="grid lg:grid-cols-5 md:ml-10 grid-cols-1 gap-4">
          {displayData.map((user) => (
            <div
              key={user.id}
              className="w-60 shadow-cyan-300 rounded-md p-3 border dark:border-gray-700"
            >
              <p className="text-base">{user.name}</p>
              <p className="text-base">{user.email}</p>
              <p className="text-base">{user.phone}</p>
              <p className="text-base">{user.role}</p>
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
  );
};

export default InstructorPage;
