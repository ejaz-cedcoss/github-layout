import {
  Badge,
  BodyLayout,
  Breadcrumb,
  Button,
  Card,
  Grid,
  Modal,
  PageHeader,
  Select,
  Tabs,
  TextStyles,
} from "@cedcommerce/ounce-ui";
import React, { FC, useEffect, useState } from "react";

const GithubAccess: FC = () => {
  const [team, setTeam] = useState<any>([]);
  const [id, setId] = useState("");
  const [teamMember, setTeamMember] = useState<any>([]);
  const [teamRepo, setTeamRepo] = useState<any>([]);
  const [role, setRole] = useState<any>([]);
  const [parent, setParent] = useState("");
  const [loading, setLoading] = useState(false);

  const colors = ["#a4e4cf", "#98a1f1", "#b793c0", "#e1e292"];

  const getMemberRole = (username: any, index: any) => {
    fetch(`https://api.github.com/teams/${id}/memberships/${username}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_GIT_TOKEN}`,
      },
    })
      .then((e) => e.json())
      .then((res) => {
        setRole([...role, (role[index] = res.role)]);
      });
  };

  // FETCHING TEAMS:-
  useEffect(() => {
    const teamFetch = () => {
      fetch(
        `https://api.github.com/orgs/${process.env.REACT_APP_ORG_NAME}/teams/${process.env.REACT_APP_TEAM_NAME}/teams
      `,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_GIT_TOKEN}`,
          },
        }
      )
        .then((e) => e.json())
        .then((res) => {
          res.map((e: any, index: any) => {
            return index === 0 ? setId(e?.id) : null;
          });

          const temp = res.map((val: any, index: any) => {
            setParent(val.parent.name);
            return {
              content: val.name,
              id: val.id,
              badge: true,
              badgeContent: "Child_team",
              customBgColors: colors[index],
            };
          });
          setTeam([...temp]);
        });
    };
    teamFetch();
  }, []);

  // FETCHING TEAM MEMBERS:-
  useEffect(() => {
    const TeamMemberFun = () => {
      fetch(`https://api.github.com/teams/${id}/members`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_GIT_TOKEN}`,
        },
      })
        .then((e) => e.json())
        .then((res) => {
          res.forEach((val: any, index: any) => {
            getMemberRole(val.login, index);
          });
          setTeamMember([...res]);
        });
    };
    id !== "" && TeamMemberFun();
  }, [id]);


  // FETCHING TEAM REPOSITORY:-
  useEffect(() => {
    fetch(`https://api.github.com/teams/${id}/repos`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_GIT_TOKEN}`,
      },
    })
      .then((e) => e.json())
      .then((res) => {
        let temp = res.map((val: any) => {
          return {
            key: val.name,
            name: val.name,
            accessLevel: val.role_name,
            visibility: val?.visibility,
          };
        });
        setTeamRepo([...temp]);
      });
  }, [id]);

  const memberCol = [
    {
      align: "left",
      dataIndex: "name",
      key: "name",
      title: "USERNAME",
      width: 100,
    },
    {
      align: "left",
      dataIndex: "repoUrl",
      key: "repoUrl",
      title: "Repository URL",
      width: 100,
    },
    {
      align: "center",
      dataIndex: "memberRole",
      key: "memberRole",
      title: "Member Role ",
      width: 100,
    },
  ];

  const repoCol = [
    {
      align: "left",
      dataIndex: "name",
      key: "name",
      title: "Team's Repository",
      width: 100,
    },
    {
      align: "left",
      dataIndex: "accessLevel",
      key: "accessLevel",
      title: "Access Level",
      width: 100,
    },
    {
      align: "left",
      dataIndex: "visibility",
      key: "visibility",
      title: "Repository Type",
      width: 100,
    },
  ];

  console.log("Role", role);

  return (
    <>
      <BodyLayout>
        <Card>
          <PageHeader title="Teams:-" />
          <TextStyles
            content={`${parent}/`}
            textcolor="positive"
            fontweight="bold"
          />
          <br />
          <Tabs
            alignment="horizontal"
            onChange={(e) => setId(e)}
            selected={id}
            value={team}
          >
            <Card cardType="Bordered">
              <TextStyles content="Members:" type="Heading" />
              <Grid
                columns={memberCol}
                dataSource={teamMember.map((val: any, index: any) => {
                  return {
                    key: val.login,
                    name: val.login,
                    repoUrl: (
                      <Badge type="Positive-100">
                        <a target="_blank" href="esa">
                          {val.repos_url}
                        </a>
                      </Badge>
                    ),
                    memberRole: (
                      <>
                        <Button type="Primary">
                          {role[index] !== undefined ? role[index] : "fetching"}
                        </Button>
                      </>
                    ),
                  };
                })}
              />
            </Card>
            <Card cardType="Bordered">
              <TextStyles content="Repositories:" type="Heading" />
              <Grid columns={repoCol} dataSource={teamRepo} />
            </Card>
          </Tabs>
        </Card>
      </BodyLayout>
    </>
  );
};

export default GithubAccess;
