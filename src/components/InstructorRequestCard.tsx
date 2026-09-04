
interface SocialLinks {
    website?: string;
    linkedin?: string;
    github?: string;
    youtube?: string;
}

interface User {
    id: number;
    fullName: string;
    email: string;
    phoneNumber: string | null;
    profilePicture: string | null;
    state: string | null;
}

interface Instructor {
    id: number;
    userId: number;
    expertise: string | null;
    bio: string | null;
    reason: string | null;
    experience: string | null;
    socialLinks: SocialLinks;
    paymentDetails: unknown | null;
    totalEarned: string;
    pendingBalance: string;
    approvalStatus: "pending" | "approved" | "rejected";
    approvedAt: string | null;
    approvedBy: number | null;
    rejectCount: number;
    user: User;
}

interface InstructorRequestCardProps {
    instructor: Instructor;
    onApprove?: (instructorId: number) => void;
    onReject?: (instructorId: number) => void;
}

export default function InstructorRequestCard({
    instructor,
    onApprove,
    onReject,
}: InstructorRequestCardProps) {
    const { user } = instructor;

    return (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md">

            {/* Header */}
            <div className="flex flex-col gap-4 border-b border-gray-100 p-6 sm:flex-row sm:items-center sm:justify-between">

                <div className="flex items-center gap-4">
                    {/* Profile */}
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-cyan-100 text-lg font-bold text-cyan-800">
                        {user.profilePicture ? (
                            <img
                                src={user.profilePicture}
                                alt={user.fullName}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            user.fullName.charAt(0).toUpperCase()
                        )}
                    </div>

                    <div>
                        <h2 className="text-lg font-bold text-gray-900">
                            {user.fullName}
                        </h2>

                        <p className="text-sm text-gray-500">
                            {user.email}
                        </p>
                    </div>
                </div>

                {/* Status */}
                <span
                    className={`
                        w-fit rounded-full px-3 py-1 text-xs font-semibold
                        ${instructor.approvalStatus === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : instructor.approvalStatus === "approved"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                        }
                    `}
                >
                    {instructor.approvalStatus.charAt(0).toUpperCase() +
                        instructor.approvalStatus.slice(1)}
                </span>
            </div>

            {/* Content */}
            <div className="space-y-6 p-6">

                {/* Expertise */}
                <section>
                    <h3 className="mb-2 text-sm font-semibold text-gray-900">
                        Expertise
                    </h3>

                    <p className="text-sm leading-6 text-gray-600">
                        {instructor.expertise || "Not provided"}
                    </p>
                </section>

                {/* Bio */}
                <section>
                    <h3 className="mb-2 text-sm font-semibold text-gray-900">
                        About
                    </h3>

                    <p className="text-sm leading-6 text-gray-600">
                        {instructor.bio || "Not provided"}
                    </p>
                </section>

                {/* Experience */}
                <section>
                    <h3 className="mb-2 text-sm font-semibold text-gray-900">
                        Experience
                    </h3>

                    <p className="text-sm leading-6 text-gray-600">
                        {instructor.experience || "Not provided"}
                    </p>
                </section>

                {/* Reason */}
                <section>
                    <h3 className="mb-2 text-sm font-semibold text-gray-900">
                        Why do they want to teach?
                    </h3>

                    <p className="text-sm leading-6 text-gray-600">
                        {instructor.reason || "Not provided"}
                    </p>
                </section>

                {/* Social Links */}
                {(instructor.socialLinks?.website ||
                    instructor.socialLinks?.linkedin ||
                    instructor.socialLinks?.github ||
                    instructor.socialLinks?.youtube) && (
                        <section>
                            <h3 className="mb-3 text-sm font-semibold text-gray-900">
                                Links
                            </h3>

                            <div className="flex flex-wrap gap-2">
                                {instructor.socialLinks.website && (
                                    <a
                                        href={instructor.socialLinks.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                                    >
                                        Website
                                    </a>
                                )}

                                {instructor.socialLinks.linkedin && (
                                    <a
                                        href={instructor.socialLinks.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100"
                                    >
                                        LinkedIn
                                    </a>
                                )}

                                {instructor.socialLinks.github && (
                                    <a
                                        href={instructor.socialLinks.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                                    >
                                        GitHub
                                    </a>
                                )}

                                {instructor.socialLinks.youtube && (
                                    <a
                                        href={instructor.socialLinks.youtube}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
                                    >
                                        YouTube
                                    </a>
                                )}
                            </div>
                        </section>
                    )}

                {/* Footer */}
                <div className="flex flex-col gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:items-center sm:justify-between">

                    <div className="text-xs text-gray-400">
                        Application ID: #{instructor.id}
                    </div>

                    {/* Actions */}
                    {instructor.approvalStatus === "pending" && (
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => onReject?.(instructor.id)}
                                className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                            >
                                Reject
                            </button>

                            <button
                                type="button"
                                onClick={() => onApprove?.(instructor.id)}
                                className="rounded-lg bg-cyan-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-800"
                            >
                                Approve
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

