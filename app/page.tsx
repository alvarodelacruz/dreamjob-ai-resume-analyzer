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

    console.log('cvFile:', cvFile);
    console.log('jobUrl:', jobUrl);

    return (
        <div className="flex flex-col items-center p-1">
            <h1 className="text-5xl mb-4">
                <span className="bg-gradient-to-r from-[#a31900] to-[#f4573b] text-transparent bg-clip-text">
                    Optimiza tu CV para conseguir tu <span className="font-bold bg-gradient-to-r from-[#ce270a] to-[#f4573b] text-transparent bg-clip-text">DreamJob</span>
                </span>
            </h1>
            <h3 className="text-[#5c5c5c] text-lg mb-8">Selecciona tu CV, pega una oferta de trabajo, y nosotros haremos la magia</h3>
            <CVUpload setCvFile={setCvFile} />
            <JobURLInput setJobUrl={setJobUrl} />
            <AnalyzeButton cvFile={cvFile} jobUrl={jobUrl} setResult={setResult} />
            <ResultsDisplay result={result} />
        </div>
    );
};
export default Page;