import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/template/Auth.jsx";
import MainPage from "./pages/template/MainPage.jsx";
import TodoForm from "./components/template/TodoForm.jsx";

function App() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleAddNew = () => {
    setEditItem(null);
    setDialogOpen(true);
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
    setEditItem(null);
  };

  const handleCreated = () => {
    setRefreshKey((k) => k + 1); // trigger MainPage re-fetch
  };

  const handleUpdated = () => {
    setRefreshKey((k) => k + 1); // trigger MainPage re-fetch
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/home"
          element={
            <MainPage
              onAddNew={handleAddNew}
              onEdit={handleEdit}
              refreshKey={refreshKey}
            />
          }
        />
      </Routes>

      {/* Dialog nằm ngoài Routes để không bị unmount khi chuyển route */}
      <TodoForm
        key={editItem?.id ?? "new"}
        open={dialogOpen}
        onClose={handleClose}
        editItem={editItem}
        onCreated={handleCreated}
        onUpdated={handleUpdated}
      />
    </>
  );
}

export default App;