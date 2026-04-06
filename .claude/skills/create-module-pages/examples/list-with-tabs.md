# List Page with Tabs Example

`src/app/(protected)/requests/page.tsx`

```typescript
import { Tabs } from "antd";
import { useState } from "react";
import { useSearchParams } from "react-router";
import { Page } from "admiral";
import Datatable from "admiral/table/datatable/index";
import { makeSource } from "@/utils/data-table";
import { PERMISSIONS } from "@/commons/constants/permissions";

import useRequestsQuery from "../_hooks/use-requests-query";

export const permissions = [PERMISSIONS.REQUESTS.READ_REQUESTS];

export const Component = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const defaultTab = searchParams.get("status") || "pending";
  const [activeTab, setActiveTab] = useState(defaultTab);

  // Example query: useRequestsQuery({ status: activeTab, ...filters })
  const { data: pendingData, isLoading: isPendingLoading } = useRequestsQuery({ status: "pending" });
  const { data: approvedData, isLoading: isApprovedLoading } = useRequestsQuery({ status: "approved" });
  const { data: rejectedData, isLoading: isRejectedLoading } = useRequestsQuery({ status: "rejected" });

  const columns = [
    { title: "Request ID", dataIndex: "id", key: "id" },
    { title: "Requester", dataIndex: "requester_name", key: "requester_name" },
    { title: "Date", dataIndex: "created_at", key: "created_at" },
  ];

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    setSearchParams({ status: key });
  };

  const tabItems = [
    {
      label: "Pending Approval",
      key: "pending",
      children: (
        <Datatable
          source={makeSource(pendingData)}
          loading={isPendingLoading}
          columns={columns}
          rowKey="id"
        />
      ),
    },
    {
      label: "Approved",
      key: "approved",
      children: (
        <Datatable
          source={makeSource(approvedData)}
          loading={isApprovedLoading}
          columns={columns}
          rowKey="id"
        />
      ),
    },
    {
      label: "Rejected",
      key: "rejected",
      children: (
        <Datatable
          source={makeSource(rejectedData)}
          loading={isRejectedLoading}
          columns={columns}
          rowKey="id"
        />
      ),
    },
  ];

  return (
    <Page title="Requests Management" noStyle>
      <Tabs
        activeKey={activeTab}
        onChange={handleTabChange}
        items={tabItems}
        className="mb-4"
        destroyInactiveTabPane={true}
      />
    </Page>
  );
};

export default Component;
```
