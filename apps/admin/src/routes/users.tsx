import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import FilterIcon from "../logo/filter.svg?react";
import SortIcon from "../logo/sort.svg?react";
import { userService, type NewUser } from "../lib/users";

export const Route = createFileRoute("/users")({
	component: UsersPage,
});

type Tab = "all" | "recent" | "pending";

function UsersPage() {
	const queryClient = useQueryClient();
	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);
	const [limit] = useState(10);
	const [sort, setSort] = useState<"asc" | "desc">("asc");
	const [activeTab, setActiveTab] = useState<Tab>("all");
	const [showAddModal, setShowAddModal] = useState(false);
	const [newUser, setNewUser] = useState<NewUser>({
		name: "",
		email: "",
		country: "",
		mobileNumber: "",
	});

	const { data: usersData, isLoading, error } = useQuery({
		queryKey: ["users", page, limit, sort, activeTab, search],
		queryFn: async () => {
			const result = await userService.listUsers({
				page,
				limit,
				sort,
				tab: activeTab,
				search: search || undefined,
			});
			if (!result.success) {
				throw new Error(result.error || "Failed to fetch users");
			}
			return result.data;
		},
	});

	useEffect(() => {
		if (error) {
			toast.error(error.message || "Failed to fetch users");
		}
	}, [error]);

	const createUserMutation = useMutation({
		mutationFn: async (data: NewUser) => {
			const result = await userService.createUser(data);
			if (!result.success) {
				throw new Error(result.error || "Failed to create user");
			}
			return result.data;
		},
		onSuccess: () => {
			toast.success("User created successfully");
			setShowAddModal(false);
			setNewUser({ name: "", email: "", country: "", mobileNumber: "" });
			queryClient.invalidateQueries({ queryKey: ["users"] });
		},
		onError: (error) => {
			toast.error(error.message || "Failed to create user");
		},
	});

	const users = usersData?.users || [];
	const total = usersData?.total || 0;
	const totalPages = Math.ceil(total / limit);

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h2 className="font-bold text-2xl text-gray-900">All users</h2>
					<p className="text-gray-600">Manage all your users and activities</p>
				</div>
				<div className="flex items-center gap-3">
					<button
						onClick={() => setSort((s) => (s === "asc" ? "desc" : "asc"))}
						className="inline-flex cursor-pointer items-center gap-2 rounded-full border-2 border-primary px-2 py-2 font-medium text-gray-900 text-sm hover:bg-gray-50"
					>
						<SortIcon className="h-3 w-3" />
						Sort
					</button>
					<button className="inline-flex cursor-pointer items-center gap-2 rounded-full border-2 border-primary px-2 py-2 font-medium text-gray-900 text-sm hover:bg-gray-50">
						<FilterIcon className="h-3 w-3" />
						Filter
					</button>
					<button
						type="button"
						onClick={() => setShowAddModal(true)}
						className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-accent px-4 py-2 font-medium text-white text-sm hover:bg-accent/90"
					>
						<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
						</svg>
						Add new user
					</button>
				</div>
			</div>

			<div className="flex items-center justify-between gap-4">
				<div className="flex gap-8 border-b border-gray-300">
					{[
						{ key: "all", label: "All Users" },
						{ key: "recent", label: "Registered recently" },
						{ key: "pending", label: "Pending verification" },
					].map((tab) => (
						<button
							type="button"
							key={tab.key}
							onClick={() => {
								setActiveTab(tab.key as Tab);
								setPage(1);
							}}
							className={`cursor-pointer pb-3 font-medium text-sm transition-colors ${
								activeTab === tab.key
									? "border-b-2 border-accent text-accent"
									: "text-gray-600 hover:text-gray-900"
							}`}
						>
							{tab.label}
						</button>
					))}
				</div>

				{!error && (
					<form
						className="relative"
						onSubmit={(e) => {
							e.preventDefault();
							setPage(1);
							queryClient.invalidateQueries({ queryKey: ["users"] });
						}}
					>
						<input
							type="text"
							placeholder="Search"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							className="w-64 rounded-full border border-gray-400 bg-gray-50 py-2 pr-4 pl-10 shadow-md focus:border-primary focus:outline-none focus:ring-primary"
						/>
						<Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-500" />
					</form>
				)}
			</div>

			<div className="relative overflow-hidden rounded-lg bg-white shadow-md">
				{isLoading && (
					<div className="absolute inset-0 flex items-center justify-center bg-white/50">
						<div className="h-8 w-8 animate-spin rounded-full border-primary border-b-2" />
					</div>
				)}
				{error ? (
					<div className="flex flex-col items-center justify-center rounded-lg bg-white py-12 shadow-lg">
						<p className="font-bold text-xl text-gray-900">
							{error.message
								.toLowerCase()
								.includes("not found")
								? "No users found"
								: "An error occurred"}
						</p>
						{!error.message.toLowerCase().includes("not found") && (
							<p className="mt-1 text-gray-600">try again later</p>
						)}
						<button
							onClick={() => queryClient.invalidateQueries({ queryKey: ["users"] })}
							className="mt-3 rounded-md bg-accent px-4 py-2 font-medium text-white hover:bg-accent/90"
						>
							Retry
						</button>
					</div>
				) : (
					<>
						<table className="min-w-full divide-y divide-gray-200">
							<thead className="bg-gray-50">
								<tr>
									<th className="px-6 py-3 text-left font-medium text-gray-900 text-xs tracking-wider">
										User Id
									</th>
									<th className="px-6 py-3 text-left font-medium text-gray-900 text-xs tracking-wider">
										Player Name
									</th>
									<th className="px-6 py-3 text-left font-medium text-gray-900 text-xs tracking-wider">
										Email address
									</th>
									<th className="px-6 py-3 text-left font-medium text-gray-900 text-xs tracking-wider">
										Registration Date
									</th>
									<th className="px-6 py-3 text-left font-medium text-gray-900 text-xs tracking-wider">
										Wallet Balance
									</th>
									<th className="px-6 py-3 text-left font-medium text-gray-900 text-xs tracking-wider">
										Status
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-200 bg-white">
								{users.length === 0 ? (
									<tr>
										<td colSpan={6} className="px-6 py-8 text-center text-gray-900">
											No users found
										</td>
									</tr>
								) : (
									users.map((user) => (
										<tr key={user.id}>
											<td className="whitespace-nowrap px-6 py-4 text-gray-900 text-sm">
												{user.id}
											</td>
											<td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 text-sm">
												{user.name}
											</td>
											<td className="whitespace-nowrap px-6 py-4 text-gray-900 text-sm">
												{user.email}
											</td>
											<td className="whitespace-nowrap px-6 py-4 text-gray-900 text-sm">
												{user.registeredDate
													? new Date(user.registeredDate).toLocaleDateString()
													: "-"}
											</td>
											<td className="whitespace-nowrap px-6 py-4 text-gray-900 text-sm">
												₦{user.wallet.toLocaleString()}
											</td>
											<td className="whitespace-nowrap px-6 py-4">
												<span
													className={`rounded-full px-2 py-1 font-medium text-xs ${
														user.status === "verified"
															? "bg-green-100 text-green-800"
															: user.status === "pending_verification"
																? "bg-yellow-100 text-yellow-800"
																: "bg-gray-100 text-gray-800"
													}`}
												>
													{user.status}
												</span>
											</td>
										</tr>
									))
								)}
							</tbody>
						</table>
					</>
				)}
			</div>

			{totalPages > 1 && (
				<div className="flex items-center justify-center gap-2">
					<button
						onClick={() => setPage((p) => Math.max(1, p - 1))}
						disabled={page === 1}
						className="rounded-md border border-gray-300 px-3 py-1 text-sm disabled:opacity-50"
					>
						Previous
					</button>
					<span className="text-gray-900 text-sm">
						Page {page} of {totalPages}
					</span>
					<button
						onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
						disabled={page === totalPages}
						className="rounded-md border border-gray-300 px-3 py-1 text-sm disabled:opacity-50"
					>
						Next
					</button>
				</div>
			)}

			{showAddModal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowAddModal(false)}>
					<div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
						<div className="mb-4 flex items-center justify-between">
							<h3 className="font-bold text-xl text-gray-900">Add new user</h3>
							<button type="button" onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-gray-900">
								<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
								</svg>
							</button>
						</div>
						<form
							onSubmit={(e) => {
								e.preventDefault();
								createUserMutation.mutate(newUser);
							}}
							className="space-y-4"
						>
							<div>
								<label className="block font-medium text-gray-900 text-sm">
									Name
								</label>
								<input
									type="text"
									value={newUser.name}
									onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
									required
									className="mt-1 w-full rounded-md border border-gray-400 px-3 py-2 text-gray-900 shadow-sm focus:border-primary focus:outline-none focus:ring-primary"
								/>
							</div>
							<div>
								<label className="block font-medium text-gray-900 text-sm">
									Email
								</label>
								<input
									type="email"
									value={newUser.email}
									onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
									required
									className="mt-1 w-full rounded-md border border-gray-400 px-3 py-2 text-gray-900 shadow-sm focus:border-primary focus:outline-none focus:ring-primary"
								/>
							</div>
							<div>
								<label className="block font-medium text-gray-900 text-sm">
									Country (optional)
								</label>
								<input
									type="text"
									value={newUser.country || ""}
									onChange={(e) => setNewUser({ ...newUser, country: e.target.value })}
									className="mt-1 w-full rounded-md border border-gray-400 px-3 py-2 text-gray-900 shadow-sm focus:border-primary focus:outline-none focus:ring-primary"
								/>
							</div>
							<div>
								<label className="block font-medium text-gray-900 text-sm">
									Mobile number (optional)
								</label>
								<input
									type="tel"
									value={newUser.mobileNumber || ""}
									onChange={(e) => setNewUser({ ...newUser, mobileNumber: e.target.value })}
									className="mt-1 w-full rounded-md border border-gray-400 px-3 py-2 text-gray-900 shadow-sm focus:border-primary focus:outline-none focus:ring-primary"
								/>
							</div>
							<div className="flex justify-end gap-3 pt-2">
								<button
									type="button"
									onClick={() => setShowAddModal(false)}
									className="rounded-md border border-gray-300 px-4 py-2 font-medium text-gray-900 hover:bg-gray-50"
								>
									Cancel
								</button>
								<button
									type="submit"
									disabled={createUserMutation.isPending}
									className="rounded-md bg-accent px-4 py-2 font-medium text-white hover:bg-accent/90 disabled:opacity-50"
								>
									{createUserMutation.isPending ? "Adding..." : "Add user"}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
}