import React, {createContext, useState, useContext, Children} from 'react'

type Notice = {
    _id: string;
    title: string;
    description: string;
    createdAt: string;
    createdBy: {
        name: string;
    };
};

type NoticeContextType = {
    latestNotice: Notice | null;
    setLatestNotice: (notice: Notice | null) => void;
};

const NoticeContext = createContext<NoticeContextType | null>(null);

export const NoticeProvider = ({children} : {children: React.ReactNode}) => {
    const [latestNotice, setLatestNotice] = useState<Notice | null>(null);

    return (
        <NoticeContext.Provider value={{latestNotice, setLatestNotice}}>
            {children}
        </NoticeContext.Provider>
    )
}

export const useNotice = () => {
    const context = useContext(NoticeContext);
    if(!context) {
        throw new Error('useNotice must be used within a NoticeProvider');
    }
    return context;
}