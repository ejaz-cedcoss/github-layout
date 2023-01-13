import { BodyLayout, Card, PageHeader, Tabs } from "@cedcommerce/ounce-ui";
import React, { FC, useEffect, useState } from "react";
import { setSourceMapRange } from "typescript";

const GithubAccess: FC = () => {
  const [team, setTeam] = useState<any>([]);
  const [id, setId] = useState("");
  const [teamMember,setTeamMember] = useState<any>([]);

  const colors = ["#a4e4cf", "#98a1f1", "#b793c0", "#e1e292"];
  useEffect(() => {
    fetch(
      `https://api.github.com/orgs/${process.env.REACT_APP_ORG_NAME}/teams`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_GIT_TOKEN}`,
        },
      }
    )
      .then((e) => e.json())
      .then((res) => {
        res.map((e:any,index:any)=> {
          return index === 0 ? setId(e?.id):null
        })
        const temp = res.map((val: any, index: any) => ({
          content: val.name,
          id: val.id,
          badge: true,
          badgeContent: "Team",
          customBgColors: colors[index],
        }));
        setTeam([...temp]);
      });
  }, []);

  useEffect(()=> {
     fetch(`https://api.github.com/teams/${id}/members`,
     {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_GIT_TOKEN}`,
        },
      }
     ).then((e)=>e.json()).then((res)=> {
         setTeamMember([...res])
     })
  },[id])

  return (
    <>
      <BodyLayout>
        <Card>
          <PageHeader title="Teams in the organization:-" />
          <Tabs
            alignment="horizontal"
            onChange={(e) => setId(e)}
            selected={id}
            value={team}
          >
            <h1>Team member</h1>
             {
                // teamMember.length !== 0 ? (
                  teamMember.map((val:any)=> {
                    return (
                        <>
                         <li>{val?.login}</li>
                        </>
                    )
                  })
                // )
                // : 
                // null
             }
          </Tabs>
          
        </Card>
      </BodyLayout>
    </>
  );
};

export default GithubAccess;
