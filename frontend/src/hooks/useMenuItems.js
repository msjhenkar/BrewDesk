import { useCallback, useEffect, useState } from "react"

import {
    getAllMenuItems,
    searchMenuItems,
    updateMenuItem,
    createMenuItem,
    deleteMenuItem
} from "../services/api";


export const useMenuItems = () => {

    

    //  Holds the array of Menu Items fetched from backend
    const [menuItems, setMenuItems] = useState([]);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState(null);

    const [editingItem, setEditingItem] = useState(null);

    const [isFormOpen, setIsFormOpen] = useState(false);

    const [deleteConfirm, setDeleteConfirm] = useState({ open: false, itemId: null });

    const [toast, setToast] = useState({ show: false, message: '', type: '' })

    const [searchKeyword, setSearchKeyword] = useState('');

    const showToast = useCallback((message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
    }, []);

     // Helper to normalize backend shape → frontend shape
    // Defined once, reused in both fetch and search
    const normalizeItem = (item) => ({
        id:          item.id,
        name:        item.itemName,       // backend "itemName" → frontend "name"
        price:       item.price,
        category:    item.category,
        description: item.description,
        imageUrl:    item.imageUrl || '',
    });

    const fetchMenuItems = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await getAllMenuItems();
            setMenuItems(response.data.map(normalizeItem));

        } catch (error) {
            setError('Failed to load menu Items');
            console.error('Fetch error:', error)

        } finally {
            setLoading(false);
        }
    }, []);


    useEffect(() => {
        fetchMenuItems();
    }, [fetchMenuItems]);

    const handleSearch = async (keyword) => {
        setSearchKeyword(keyword);

        if (!keyword.trim()) {
            fetchMenuItems();
            return
        }

        setLoading(true)
        try {
            const response = await searchMenuItems(keyword);
            setMenuItems(response.data);

        } catch (error) {
            setError('search Failed');

        } finally {
            setLoading(false)

        }

    };


    // --CREATE--
    const handleCreate = async (formData) => {
        setLoading(true);
        try {
            await createMenuItem(formData);
            //After creating, reload the list so the new item appears
            await fetchMenuItems();
            setIsFormOpen(false);
            showToast('Menu item created successfully');
        } catch (err) {
            showToast('Failed to create item. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    }

    // _______UPDATE_______________
    const handleUpdate = async (formData) => {
        setLoading(true);
        try {
            const payload = {
                itemName:    formData.name,
                price:       formData.price,
                category:    formData.category,
                description: formData.description,
                imageUrl:    formData.imageUrl,
            };
            await updateMenuItem(editingItem.id, payload);
            await fetchMenuItems();
            setIsFormOpen(false);
            setEditingItem(null);
            showToast('Menu item updated successfully')
        } catch (err) {
            showToast('Failed to update item. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    }

    // ── DELETE ───────────────────────────────────────────────────────
    const handleDelete = async () => {
        setLoading(true);
        try {
            await deleteMenuItem(deleteConfirm.itemId);
            await fetchMenuItems();
            setDeleteConfirm({ open: false, itemId: null });
            showToast('Menu item deleted.', 'info');
        } catch (err) {
            showToast('Failed to delete item.', 'error');
        } finally {
            setLoading(false);
        }
    };

    // ── OPEN EDIT MODAL ──────────────────────────────────────────────
    const openEditForm = (item) => {
        setEditingItem(item);   // Store which item we're editing
        setIsFormOpen(true);    // Open the modal
    };

    // ── OPEN CREATE MODAL ────────────────────────────────────────────
    const openCreateForm = () => {
        setEditingItem(null);   // null = create mode (not edit mode)
        setIsFormOpen(true);
    };

    // Return everything the component needs — state values AND functions
    // The component will destructure this object
    return {
        menuItems, loading, error, editingItem,
        isFormOpen, setIsFormOpen,
        deleteConfirm, setDeleteConfirm,
        toast, searchKeyword,
        handleSearch, handleCreate, handleUpdate, handleDelete,
        openEditForm, openCreateForm,
    };


}