import { useRouter } from "next/router";
import { FiAlertTriangle, FiHome, FiRefreshCw } from "react-icons/fi";

export default function AuthError() {
  const router = useRouter();
  const { error } = router.query;

  const getErrorMessage = (error) => {
    switch (error) {
      case "Configuration":
        return "There is a problem with the server configuration.";
      case "AccessDenied":
        return "You do not have permission to sign in.";
      case "Verification":
        return "The verification link was invalid or has expired.";
      case "OAuthCallback":
      default:
        return "There was an error while trying to authenticate. Please try again.";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg text-center">
        <div className="mx-auto h-16 w-16 bg-red-100 rounded-full flex items-center justify-center">
          <FiAlertTriangle className="h-8 w-8 text-red-600" />
        </div>
        
        <h2 className="mt-6 text-2xl font-bold text-gray-900">
          Authentication Error
        </h2>
        
        <p className="mt-4 text-gray-600">
          {getErrorMessage(error)}
        </p>

        <div className="mt-8 space-y-4">
          <button
            onClick={() => router.push("/auth/signin")}
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            <FiRefreshCw className="mr-2" />
            Try Again
          </button>
          
          <button
            onClick={() => router.push("/")}
            className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            <FiHome className="mr-2" />
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
}