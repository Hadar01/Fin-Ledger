import { useContext } from "react";
import { SIDE_MENU_DATA } from "../../utlis/data";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import CharAvatar from "../Cards/CharAvatar";

export default function SideMenu ({ activeMenu }) {
    const { user, clearUser } = useContext(UserContext);

    const navigate = useNavigate();


    const handleClick = (route) => {
        if (route === "/logout") {
            handleLogout();
            return;
        }

        navigate(route);
    };

    const handleLogout = async () => {
        await clearUser();
        localStorage.clear();
    }


    return (
        <div className="w-64 h-[calc(100vh-61px)] bg-white border-r border-gray-200/50 p-5 sticky top-[61px] z-20">
            <div className="flex flex-col items-center justify-center gap-3 mt-3 mb-7">
                <CharAvatar
                    fullName={user?.fullName}
                    width="w-20"
                    height="h-20"
                    style="text-xl"
                />

                <h5 className="text-gray-950 font-medium leading-5">{user?.fullName || ""}</h5>
            </div> 

                    {SIDE_MENU_DATA.map((item, index) => (
                        <button
                            key={`menu_${index}`}
                            className={`
        w-full flex items-center gap-4 text-[15px] cursor-pointer py-3 px-6 rounded-lg mb-3
        ${item.label === "Logout"
            ? "hover:text-red-500 hover:bg-red-50 text-red-600"
            : "hover:text-purple-500 hover:bg-purple-50"
        }
        ${activeMenu === item.label
            ? item.label === "Logout"
                ? "text-red-700 bg-red-100"
                : "text-purple-700 bg-purple-100"
            : ""
        }
    `}
                            onClick={() => handleClick(item.path)}
                        >
                            <item.icon className="text-xl" />
                            {item.label}
                        </button>
                    ))}
        </div>
    )
}