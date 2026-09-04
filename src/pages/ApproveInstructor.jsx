import { useEffect, useState } from "react";
import { approveStatus, fetchAllInstructors } from "../service/user";
import InstructorRequestCard from "../components/InstructorRequestCard";
import Loader from "../components/Loading";

export default function ApproveInstructorReq() {
    const [instructors, setInstructors] = useState([]);
    const [loading, setLoading] = useState(false); // ✅ Fixed lowercase 'loading'

    const fetchData = async () => {
        try {
            setLoading(true);
            const { data } = await fetchAllInstructors();
            setInstructors(data || []);
        } catch (error) {
            console.error("Failed to fetch instructor requests:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleApprove = async (instructorId) => {
        try {
            const data = await approveStatus(instructorId, "accept");
            console.log("DATA AFTER APPROVE: ", data);
            // ✅ Optimistic UI update (removes card instantly without full re-loading screen)
            setInstructors((prev) =>
                prev.filter((item) => (item.id || item._id) !== instructorId)
            );
        } catch (error) {
            console.error("Error approving instructor status:", error);
        }
    };

    const handleReject = async (instructorId) => {
        try {
            // ✅ Added full API handling & optimistic UI update
            await approveStatus(instructorId, "reject");

            setInstructors((prev) =>
                prev.filter((item) => (item.id || item._id) !== instructorId)
            );
        } catch (error) {
            console.error("Error rejecting instructor status:", error);
        }
    };

    return (
        <div className="mx-auto max-w-5xl px-6 py-8">
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">
                    Instructor Requests
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                    Review applications from users who want to become instructors.
                </p>
            </div>

            {/* Requests */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader />
                </div>
            ) : instructors.length === 0 ? (
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
                        key={instructor.id || instructor._id} // ✅ Fallback for MongoDB _id
                        instructor={instructor}
                        onApprove={handleApprove}
                        onReject={handleReject}
                    />
                ))
            )}
        </div>
    );
}