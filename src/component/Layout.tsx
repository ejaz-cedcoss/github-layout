import { Button, Sidebar, Topbar } from "@cedcommerce/ounce-ui";
import { MenuI } from "@cedcommerce/ounce-ui/dist/components/Sidebar/Sidebar";
import React, { FC, useEffect } from "react";
import { GitHub } from "react-feather";
import { useNavigate } from "react-router-dom";

const Layout: FC = () => {
  let navigate = useNavigate();
  
  const menu = [
    {
      id: "dashboard",
      content: "Dashboard",
      path: "/",
    },
    {
      id: "Github Access",
      content: "Github Access",
      path: "/github",
      icon: <GitHub />,
    },
  ];
  const onchange = (e: any) => {
    navigate(`${e.path}`);
  };
  return (
    <>
      <Topbar
        connectLeft={<Button type="Secondary" content="App" />}
        account={{
          name: "ejaz-cedcoss",
          userPopoverMenu: (
            <>
              <Button
                length="fullBtn"
                type="Plain"
                halign="Start"
                // icon={<User size={20} />}
              >
                Profile
              </Button>
              <Button
                length="fullBtn"
                type="Plain"
                halign="Start"
                // icon={<Settings size={20} />}
              >
                Settings
              </Button>
              <Button
                length="fullBtn"
                type="Plain"
                halign="Start"
                // icon={<LogOut size={20} />}
              >
                Logout
              </Button>
            </>
          ),
        }}
      />
      <Sidebar
        menu={menu}
        subMenu={[]}
        onChange={(e) => {
          onchange(e);
        }}
      />
    </>
  );
};
export default Layout;
