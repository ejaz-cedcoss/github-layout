import {
  BodyLayout,
  Button,
  Card,
  Grid,
  Modal,
  PageHeader,
  Tabs,
  TextStyles,
} from "@cedcommerce/ounce-ui";
import React, { FC, useEffect, useState } from "react";
import { PlusCircle } from "react-feather";

const GithubAccess: FC = () => {
  const [team, setTeam] = useState<any>([]);
  const [id, setId] = useState("");

  const [teamMember, setTeamMember] = useState<any>([]);
  const [teamRepo, setTeamRepo] = useState<any>([]);
  const [parent, setParent] = useState("");
  const [allMember, setAllMember] = useState<any>([]);

  const [counter, setCounter] = useState<any>(2);
  const [loading, setLoading] = useState(false);

  const [openModal, setOpenModal] = useState(false);
  const [collaborators, setCollaborator] = useState<any>([]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const colors = ["#a4e4cf", "#98a1f1", "#b793c0", "#e1e292"];

  /**FIND MEMBER ROLE FUNCTION */
  const findMemberRole = (username: any) => {
    const memberRoleFetch = () => {
      fetch(`https://api.github.com/teams/${id}/memberships/${username}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_GIT_TOKEN}`,
        },
      })
        .then((e) => e.json())
        .then((res) => {
          const tempTeamMember = [...teamMember];
          tempTeamMember.forEach((val) => {
            val.role = res.role;
          });
          setTeamMember([...tempTeamMember]);
        })
        .finally(() => {});
    };
    memberRoleFetch();
  };

  /**GET COLLABORATOR FUNCTION  */
  const getCollaborator = (repoName: any) => {
    fetch(
      `https://api.github.com/repos/${process.env.REACT_APP_ORG_NAME}/${repoName}/collaborators`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_GIT_TOKEN}`,
        },
      }
    )
      .then((e) => e.json())
      .then((res) => {
        setCollaborator([...res]);
      });
  };

  // VIEW MORE DATA FUNCTION :-
  const ViewMoreData = () => {
    setCounter(counter + 1);
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
      setLoading(true);
      fetch(
        `https://api.github.com/teams/${id}/members?page=1&per_page=${counter}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_GIT_TOKEN}`,
          },
        }
      )
        .then((e) => e.json())
        .then((res) => {
          setTeamMember([...res]);
        })
        .finally(() => setLoading(false));
    };
    const allTeamMeberFun = () => {
      fetch(`https://api.github.com/teams/${id}/members`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_GIT_TOKEN}`,
        },
      })
        .then((e) => e.json())
        .then((res) => {
          setAllMember([...res]);
        });
    };
    id !== "" && TeamMemberFun();
    allTeamMeberFun();
  }, [id, counter]);

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
            repo_URL: val?.clone_url,
            collaborator: (
              <Button
                content="show"
                onClick={() => {
                  setOpenModal(!openModal);
                }}
              >
                {getCollaborator(val?.name)}
              </Button>
            ),
          };
        });
        setTeamRepo([...temp]);
      });
  }, [id, openModal]);

  /**member column */
  const memberCol = [
    {
      align: "left",
      dataIndex: "name",
      key: "name",
      title: "USERNAME",
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

  /**Repository column */
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
      dataIndex: "repo_URL",
      key: "repo_URL",
      title: "Repository URL",
    },
    {
      align: "left",
      dataIndex: "visibility",
      key: "visibility",
      title: "Repository Type",
      width: 100,
    },
    {
      align: "left",
      dataIndex: "collaborator",
      key: "collaborator",
      title: "Collaborator's",
      width: 100,
    },
  ];

  // collaborator's columns:-
  const collaboratorCol = [
    {
      align: "left",
      dataIndex: "collaborators",
      key: "collaborators",
      title: "Collaborator's Name",
    },
  ];

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
                loading={loading}
                dataSource={teamMember.map((val: any, index: any) => {
                  return {
                    key: val.login,
                    name: val.login,
                    memberRole: val.role ?? (
                      <Button type="Primary" content="Fetching...">
                        {findMemberRole(val.login)}
                      </Button>
                    ),
                  };
                })}
              />
              {allMember.length > teamMember.length ? (
                <div style={{ marginTop: "15px" }}>
                  <Button
                    type="Outlined"
                    content="view more"
                    icon={<PlusCircle color="green" />}
                    onClick={() => {
                      ViewMoreData();
                    }}
                  />
                </div>
              ) : (
                ""
              )}

              {/* // MODAL SECTION */}
              <Modal
                open={openModal}
                close={() => setOpenModal(!openModal)}
                heading="All collaborators access to this repository"
                modalSize="medium"
                secondaryAction={{
                  content: "Close",
                  loading: false,
                  onClick: () => setOpenModal(!openModal),
                }}
              >
                <Grid
                  columns={collaboratorCol}
                  showHeader={false}
                  dataSource={collaborators.map((val: any) => {
                    return {
                      key: val.login,
                      collaborators: val.login,
                    };
                  })}
                />
              </Modal>
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
