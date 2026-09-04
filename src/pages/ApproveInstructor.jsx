
import { useEffect, useState } from "react";
import { fetchAllInstructors } from "../service/user";
import InstructorRequestCard from "../components/InstructorRequestCard";

export default function ApproveInstructorReq() {
    const [instructors, setInstructors] = useState([]);

    const fetchData = async () => {
        try {
            const { data } = await fetchAllInstructors();

            setInstructors(data);
        } catch (error) {
            console.error("Failed to fetch instructor requests:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleApprove = async (instructorId) => {
        console.log("Approve:", instructorId);

        // API call
        // await approveInstructor(instructorId);

        // Refresh list
        // fetchData();
    };

    const handleReject = async (instructorId) => {
        console.log("Reject:", instructorId);

        // API call
        // await rejectInstructor(instructorId);

        // Refresh list
        // fetchData();
    };

    return (
        <div className="mx-auto max-w-5xl px-6 py-8">

            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">
                    Instructor Requests
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                    Review applications from users who want to become
                    instructors.
                </p>
            </div>

            {/* Requests */}
            <div className="space-y-5">
                {instructors.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-gray-300 p-10 text-center">
                        <p className="font-medium text-gray-600">
                            No instructor requests found.
                        </p>

                        <p className="mt-1 text-sm text-gray-400">
                            New instructor applications will appear here.
                        </p>
                    </div>
                ) : (
                    instructors.map((instructor) => (
                        <InstructorRequestCard
                            key={instructor.id}
                            instructor={instructor}
                            onApprove={handleApprove}
                            onReject={handleReject}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

