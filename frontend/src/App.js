import "./App.css";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import SummaryApi from "./common";
import Context from "./context";
import { useDispatch, useSelector } from "react-redux";
import { setUserDetails } from "./store/userSlice";
import FloatingContactWidget from "./components/FloatingContactWidget";
import CompactBottomBanner from "./components/CompactBottomBanner";
import TopHeader from "./components/TopHeader";

function App() {
  const dispatch = useDispatch();
  const [cartProductCount, setCartProductCount] = useState(0);
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const user = useSelector((state) => state.user.user); // ✅ Lấy user từ Redux

  const fetchUserDetails = async () => {
    const dataResponse = await fetch(SummaryApi.current_user.url, {
      method: SummaryApi.current_user.method,
      credentials: "include",
    });

    const dataApi = await dataResponse.json();

    if (dataApi.success) {
      dispatch(setUserDetails(dataApi.data));
    }
  };

  const fetchUserAddToCart = async () => {
    const dataResponse = await fetch(SummaryApi.addToCardProductCount.url, {
      method: SummaryApi.addToCardProductCount.method,
      credentials: "include",
    });

    const dataApi = await dataResponse.json();

    setCartProductCount(dataApi?.data?.count);
  };

  useEffect(() => {
    fetchUserDetails();
    fetchUserAddToCart();
  }, []);

  return (
    <Context.Provider
      value={{
        user, // ✅ Truyền user vào context
        fetchUserDetails,
        cartProductCount,
        fetchUserAddToCart,
      }}
    >
      <ToastContainer position="top-center" />
      <Header />
      <TopHeader />
      <main
        className={`min-h-[calc(100vh-120px)] ${isHomePage ? "pt-16" : ""}`}
      >
        <Outlet />
      </main>
      <FloatingContactWidget />
      <CompactBottomBanner />
      <Footer />
    </Context.Provider>
  );
}

export default App;
