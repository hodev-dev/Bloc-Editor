import React from 'react'
import ActionBar from '../ui/components/ActionBar'
import BlockEditor from '../ui/components/BlockEditor'
import Notification from '../ui/components/Notification';
import SearchField from '../ui/components/SearchField';

export const Search = () => {
    return (
        <div className="flex justify-center min-h-screen">
            <ActionBar />
            <SearchField />
            <Notification />
        </div>
    )
}
