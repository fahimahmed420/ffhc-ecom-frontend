import { Home, Grid, User, ShoppingBag } from "lucide-react";

export default function BottomNav() {
  return (
    <div className="fixed bottom-0 border-t border-gray-300 left-0 right-0 bg-white shadow-md flex justify-around py-3 md:hidden">
      <Home />
      <Grid />
      <User />
      <ShoppingBag />
    </div>
  );
}