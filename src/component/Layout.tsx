import { Button, Sidebar, Topbar } from "@cedcommerce/ounce-ui";
import React, { FC, useState,  } from "react";
import { GitHub } from "react-feather";
import { useLocation, useNavigate } from "react-router-dom";

const Layout: FC = () => {
  let navigate = useNavigate();
  let location = useLocation();
  
  const menu = [
    {
      id: "dashboard",
      content: "Dashboard",
      path: "/dashboard",
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
              >
                Profile
              </Button>
              <Button
                length="fullBtn"
                type="Plain"
                halign="Start"
              >
                Settings
              </Button>
              <Button
                length="fullBtn"
                type="Plain"
                halign="Start"
              >
                Logout
              </Button>
            </>
          ),
        }}
      />
      <Sidebar
        menu={menu}
        path={location.pathname}
        subMenu={[]}
        onChange={(e) => {
          onchange(e);
        }}
      />
    </>
  );
};
export default Layout;
