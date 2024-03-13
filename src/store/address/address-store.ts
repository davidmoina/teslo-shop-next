import { create } from "zustand";
import { persist } from "zustand/middleware";

interface State {
  address: {
    firstName: string;
    lastName: string;
    address: string;
    address2?: string;
    postalCode: string;
    city: string;
    country: string;
    phone: string;
  }
}

interface Action {
  setAddress: (address: State["address"]) => void;
  // resetAddress: () => void;
}

export const useAddressStore = create<State & Action>()(
  persist(
    (set, get) => ({
      address: {
        firstName: "",
        lastName: "",
        address: "",
        address2: "",
        postalCode: "",
        city: "",
        country: "",
        phone: "",
      },
      setAddress: (address) => {
        set({ address })
      },
    }),
    {
      name: "address-storage"
    }
  )

)