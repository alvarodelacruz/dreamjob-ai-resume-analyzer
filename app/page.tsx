'use client';

import React, { useState } from 'react';
import CVUpload from '../components/CVUpload';
import JobURLInput from '../components/JobURLInput';
import AnalyzeButton from '../components/AnalyzeButton';
import ResultsDisplay from '../components/ResultsDisplay';

const Page: React.FC = () => {
    const [cvFile, setCvFile] = useState<File | null>(null);
    const [jobUrl, setJobUrl] = useState<string>('');
    const [result, setResult] = useState<string>('');

    return (
        <div className="flex flex-col items-center p-1 mx-auto">
            <h1 className="text-4xl md:text-5xl mb-8 text-center">
                <span className="bg-gradient-to-r from-[#a31900] to-[#f4573b] text-transparent bg-clip-text">
                    Optimiza tu CV para conseguir tu <span className="font-bold bg-gradient-to-r from-[#ce270a] to-[#f4573b] text-transparent bg-clip-text">DreamJob</span>
                </span>
            </h1>
            
            <div className="w-full max-w-4xl flex flex-col items-center">
                <CVUpload setCvFile={setCvFile} />
                <JobURLInput setJobUrl={setJobUrl} />
                
                <div className="w-full flex justify-center my-6">
                    <AnalyzeButton cvFile={cvFile} jobUrl={jobUrl} setResult={setResult} />
                </div>
            </div>
            
            <ResultsDisplay result={result} />
        </div>
    );
};
export default Page;