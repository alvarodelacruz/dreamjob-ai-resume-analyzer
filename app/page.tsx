import React from 'react';
import CVUpload from '../components/CVUpload';
import JobURLInput from '../components/JobURLInput';
import AnalyzeButton from '../components/AnalyzeButton';
import ResultsDisplay from '../components/ResultsDisplay';

const Page: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <h1 className="text-2xl font-bold mb-4">CV Analyzer</h1>
            <CVUpload />
            <JobURLInput />
            <AnalyzeButton />
            <ResultsDisplay />
        </div>
    );
};

export default Page;