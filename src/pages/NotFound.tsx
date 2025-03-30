
import React from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-2">404</h1>
      <p className="text-xl text-gray-600 mb-4">Oops! Page not found</p>
      <p className="text-gray-500 mb-6">
        The page {location.pathname} doesn't exist
      </p>
      <Button
        className="bg-brand-500 hover:bg-brand-600"
        onClick={() => navigate("/")}
      >
        Go Back Home
      </Button>
    </div>
  );
};

export default NotFound;
