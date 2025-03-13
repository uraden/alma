"use client";
import React, { useState, useEffect } from "react";
import { Layout, Menu, theme, Table, Tag, Button, Select, Input } from "antd";
import { getUsers, updateUser } from "../components/request";
import { FaExternalLinkAlt } from "react-icons/fa";

const { Option } = Select;
const { Content, Footer, Sider } = Layout;
const { Search } = Input;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const items2 = [
  getItem(<div className="text-[18px]">Leads</div>, "1", ""),
  getItem(<div className="text-[18px]">Setting</div>, "2", ""),
];

const ListOfUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [editingKey, setEditingKey] = useState("");

  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (record) => {
    try {
      const updatedUser = users.find((item) => item.key === record.key);

      await updateUser(record.id, {
        status: updatedUser?.status,
      });

      setEditingKey("");
      fetchUsers();
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  const handleStatusChange = (value, key) => {
    const newData = users.map((user) =>
      user.key === key ? { ...user, status: value } : user
    );
    setUsers(newData);
    setFilteredUsers(newData); 
  };

  const onSearch = (value) => {
    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(value.toLowerCase()) ||
        user.lastName.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const onStatusFilterChange = (value) => {
    if (value) {
      const filtered = users.filter((user) => user.status === value);
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users); // Reset to show all users if no status is selected
    }
  };

  const fetchUsers = async () => {
    const data = await getUsers();
    setUsers(data);
    setFilteredUsers(data); 
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const bottomItem = [
    {
      key: "bottom",
      label: (
        <div className="flex items-center">
          <div className="w-[40px] h-[40px] bg-gray-200 text-[20px] rounded-[50px] flex justify-center font-semibold">
            A
          </div>
          <div className="ml-[10px] font-semibold text-[20px]">Admin</div>
        </div>
      ),
    },
  ];

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      key: "lastName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status, record) => {
        const editable = isEditing(record);
        return editable ? (
          <Select
            defaultValue={status}
            style={{ width: 120 }}
            onChange={(value) => handleStatusChange(value, record.key)}
          >
            <Option value="PENDING">Pending</Option>
            <Option value="REACHED_OUT">Reached Out</Option>
          </Select>
        ) : (
          <Tag color={status === "PENDING" ? "yellow" : "green"} key={status}>
            {status}
          </Tag>
        );
      },
    },
    {
      title: "Linkedin",
      dataIndex: "linkedInUrl",
      key: "linkedInUrl",
      render: (text) => (
        <a href={text} target="_blank" rel="noreferrer">
          <FaExternalLinkAlt />
        </a>
      ),
    },
    {
      title: "Resume",
      dataIndex: "resumeUrl",
      key: "resumeUrl",
      render: (text) => (
        <a href={text} target="_blank" rel="noreferrer">
          <FaExternalLinkAlt />
        </a>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Button
              type="primary"
              onClick={() => save(record)}
              style={{ marginRight: 8 }}
            >
              Save
            </Button>
            <Button onClick={() => cancel(record.key)}>Cancel</Button>
          </span>
        ) : (
          <Button onClick={() => edit(record)} disabled={editingKey !== ""}>
            Edit
          </Button>
        );
      },
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={(broken) => {
          console.log(broken);
        }}
        width={300}
        theme="light"
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            height: "100px",
            marginBottom: "20px",
          }}
        >
          <img src="./alma.png" alt="Logo" className="w-[170px] " />
        </div>

        <Menu
          theme="light"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={items2}
        />
        <div
          className="bg-siderbar"
          style={{ position: "absolute", bottom: 0, width: "100%" }}
        >
          <Menu
            theme="light"
            mode="inline"
            items={bottomItem}
            selectable={false}
          />
        </div>
      </Sider>
      <Layout>
        <Content
          style={{
            margin: "24px 16px 0",
            flex: 1,
          }}
        >
          <div
            style={{
              padding: 24,
              minHeight: "100%",
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <div>
              <div className="mb-[40px]">
                <h1 className="text-[30px] font-bold">Leads</h1>
              </div>
              <div className="mb-[20px]">
                <Search
                  placeholder="input search text"
                  onSearch={onSearch}
                  style={{
                    width: 200,
                    marginRight: "20px",
                  }}
                />

                <Select
                  style={{ width: 150 }}
                  onChange={onStatusFilterChange}
                  placeholder="Filter by Status"
                  allowClear
                >
                  <Option value="PENDING">PENDING</Option>
                  <Option value="REACHED_OUT">REACHED_OUT</Option>
                </Select>
              </div>
              <div>
                <Table dataSource={filteredUsers} columns={columns} />
              </div>
            </div>
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}></Footer>
      </Layout>
    </Layout>
  );
};

export default ListOfUsers;