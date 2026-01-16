import React from "react";
import { useNavigate } from "react-router-dom";
import { Menu, SquarePen } from "lucide-react";
import Button from "../ui/Button";

interface HeaderProps {
  routineName: string;
  routineId: string;
}

const Header: React.FC<HeaderProps> = ({ routineName, routineId }) => {
  const navigate = useNavigate();

  return (
    <header className="w-full max-w-md flex justify-between items-center pt-2">
      <Button
        onClick={() => navigate("/")}
        icon={Menu}
        size="sm"
        aria-label="Back to routines"
      />
      <h1 className="text-xl font-bold tracking-tight flex-1 text-center">
        {routineName}
      </h1>
      <Button
        onClick={() => navigate(`/routine/${routineId}/edit`)}
        size="sm"
        aria-label="Edit routine"
        className="ml-auto"
        icon={SquarePen}
      />
    </header>
  );
};

export default Header;
