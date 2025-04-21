
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  Timestamp,
  serverTimestamp
} from "firebase/firestore";
import { db } from "./config";

// Collections
const EXPENSES_COLLECTION = "expenses";
const CATEGORIES_COLLECTION = "categories";
const BUDGETS_COLLECTION = "budgets";

// Add a new expense
export const addExpense = async (userId, expenseData) => {
  try {
    const docRef = await addDoc(collection(db, EXPENSES_COLLECTION), {
      ...expenseData,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    throw error;
  }
};

// Get all expenses for a user
export const getUserExpenses = async (userId) => {
  try {
    const q = query(
      collection(db, EXPENSES_COLLECTION),
      where("userId", "==", userId),
      orderBy("date", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    const expenses = [];
    
    querySnapshot.forEach((doc) => {
      expenses.push({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate() // Convert Timestamp to JS Date
      });
    });
    
    return expenses;
  } catch (error) {
    throw error;
  }
};

// Update an expense
export const updateExpense = async (expenseId, expenseData) => {
  try {
    const expenseRef = doc(db, EXPENSES_COLLECTION, expenseId);
    await updateDoc(expenseRef, {
      ...expenseData,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    throw error;
  }
};

// Delete an expense
export const deleteExpense = async (expenseId) => {
  try {
    const expenseRef = doc(db, EXPENSES_COLLECTION, expenseId);
    await deleteDoc(expenseRef);
    return true;
  } catch (error) {
    throw error;
  }
};

// Add a category
export const addCategory = async (userId, categoryData) => {
  try {
    const docRef = await addDoc(collection(db, CATEGORIES_COLLECTION), {
      ...categoryData,
      userId,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    throw error;
  }
};

// Get user categories
export const getUserCategories = async (userId) => {
  try {
    const q = query(
      collection(db, CATEGORIES_COLLECTION),
      where("userId", "==", userId)
    );
    
    const querySnapshot = await getDocs(q);
    const categories = [];
    
    querySnapshot.forEach((doc) => {
      categories.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return categories;
  } catch (error) {
    throw error;
  }
};

// Add a budget
export const addBudget = async (userId, budgetData) => {
  try {
    const docRef = await addDoc(collection(db, BUDGETS_COLLECTION), {
      ...budgetData,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    throw error;
  }
};

// Get user budgets
export const getUserBudgets = async (userId) => {
  try {
    const q = query(
      collection(db, BUDGETS_COLLECTION),
      where("userId", "==", userId)
    );
    
    const querySnapshot = await getDocs(q);
    const budgets = [];
    
    querySnapshot.forEach((doc) => {
      budgets.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return budgets;
  } catch (error) {
    throw error;
  }
};

// Update a budget
export const updateBudget = async (budgetId, budgetData) => {
  try {
    const budgetRef = doc(db, BUDGETS_COLLECTION, budgetId);
    await updateDoc(budgetRef, {
      ...budgetData,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    throw error;
  }
};

// Format date for Firestore
export const formatDateForFirestore = (date) => {
  return Timestamp.fromDate(new Date(date));
};
