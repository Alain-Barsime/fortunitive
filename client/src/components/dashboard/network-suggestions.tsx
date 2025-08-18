import { Button } from "@/components/ui/button";

// Mock data for network suggestions
const networkSuggestions = [
  {
    id: "1",
    name: "Sarah Wilson",
    title: "UX Designer at Google",
    profilePicture: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&h=100",
  },
  {
    id: "2",
    name: "David Kim",
    title: "Product Manager at Meta",
    profilePicture: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&h=100",
  },
  {
    id: "3",
    name: "Jennifer Brown",
    title: "Data Scientist at Netflix",
    profilePicture: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?auto=format&fit=crop&w=100&h=100",
  },
];

export function NetworkSuggestions() {
  return (
    <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">People You May Know</h2>
        <a href="/network" className="text-primary hover:text-blue-800 text-sm">
          See All
        </a>
      </div>

      <div className="space-y-4">
        {networkSuggestions.map((person) => (
          <div key={person.id} className="flex items-center justify-between">
            <div className="flex items-center">
              <img
                src={person.profilePicture}
                alt="Network suggestion"
                className="w-10 h-10 rounded-full"
              />
              <div className="ml-3">
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {person.name}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {person.title}
                </p>
              </div>
            </div>
            <Button size="sm">Connect</Button>
          </div>
        ))}
      </div>
    </section>
  );
}
