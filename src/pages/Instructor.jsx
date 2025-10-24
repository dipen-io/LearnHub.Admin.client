import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MessageCircleWarning, MoveLeft } from "lucide-react";
import RequestList from "../components/Request";
import { getInstructors } from "../service/user";
import { users } from "../data/user";

const normalizeUserData = (user) => ({
  id: user.id,
  name: user.name || "Unknown User",
  email: user.email || "No Email",
  phone: user.phone || "No Phone",
});

const normalizeInstructorData = (instructor) => ({
  id: instructor._id,
  name: instructor.channelName || "Unknown Instructor",
  email: instructor.user?.email || "No Email",
  phone: instructor.user?.phoneNumber || "No Phone",
});

const InstructorPage = () => {
  const [selected, setSelected] = useState("users");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [showRequestPage, setShowRequestPage] = useState(false);
  const usersPerPage = 30;
  const [displayData, setDisplayData] = useState(() =>
    users.map(normalizeUserData)
  );

  const options = ["users", "students", "instructors"];

  const {
    data: instructorsData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["instructors"],
    queryFn: getInstructors,
    enabled: selected === "instructors",
  });

  const handleRequestClick = () => setShowRequestPage(true);
  const handleBackToUsers = () => setShowRequestPage(false);

  const filteredUsers = displayData.filter((user) =>
    (user.fullName || user.name || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  const handlePageClick = (pageNumber) => setCurrentPage(pageNumber);

  // ✅ Request page condition — this part is fine

  useEffect(() => {
    if (selected === "instructors" && instructorsData) {
      setDisplayData(instructorsData.map(normalizeInstructorData));
    } else if (selected === "users") {
      setDisplayData(users.map(normalizeUserData));
    }
    setCurrentPage(1);
  }, [selected, instructorsData]);

  if (showRequestPage) {
    return (
      <div className="w-full bg-blue-100 dark:bg-blue-950 text-black dark:text-white p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Incoming Requests for Instructor</h1>
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

  return (
    <div>
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
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
          onClick={handleRequestClick}
        >
          <MessageCircleWarning
            size={35}
            className="bg-red-400 dark:bg-blue-950 rounded-full"
          />
          {isOpen && (
            <div
              id="dropdownHover"
              className="absolute z-10 mt-5 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 h-9 dark:bg-gray-700 py-1"
            >
              Request Incoming
            </div>
          )}
        </div>

        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="mr-10 shadow-md dark:bg-blue-700 dark:shadow-amber-950 hover:shadow-fuchsia-950 rounded-md hover:border border-blue-500 px-10 py-3 bg-white text-xl"
        >
          {options.map((option) => (
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
          className="shadow-md md:w-1/2 w-full md:mx-0 mx-2 py-3 bg-white rounded-2xl px-5 dark:text-slate-400 text-slate-400"
        />
      </div>

      {/* ✅ FIXED: Clean conditional rendering */}
      {selected === "instructors" ? (
        isLoading ? (
          <div className="text-center text-lg font-semibold">
            Loading instructors...
          </div>
        ) : isError ? (
          <div className="text-center text-red-500">
            Failed to fetch instructors.
            <button
              className="ml-2 underline text-blue-600"
              onClick={() => refetch()}
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-5 md:ml-10 grid-cols-1">
            {currentUsers.map((user) => (
              <div
                key={user.id}
                className="w-60 shadow-cyan-300 rounded-md p-3 border dark:border-gray-700"
              >
                <p className="text-base">{user.name}</p>
                <p className="text-base">{user.email}</p>
                <p className="text-base">{user.phone}</p>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="grid lg:grid-cols-5 md:ml-10 grid-cols-1">
          {currentUsers.map((user) => (
            <div
              key={user.id}
              className="w-60 shadow-cyan-300 rounded-md p-3 border dark:border-gray-700"
            >
              <p className="text-base">{user.name}</p>
              <p className="text-base">{user.email}</p>
              <p className="text-base">{user.phone}</p>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {currentUsers.length > 0  && (
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

