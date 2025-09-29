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
        <div 
            className="flex flex-col items-center p-1 mx-auto" 
            style={{ 
                transform: 'scale(0.9)', 
                transformOrigin: 'top center',
                margin: '0 auto',
                width: '100%',
                maxWidth: 'calc(100% / 0.9)'  // Compensación exacta para escala de 0.9
            }}
        >
            <h1 className="text-4xl md:text-5xl mb-8 text-center">
                <span className="font-['Raleway'] font-light bg-gradient-to-r from-[#a31900] to-[#f4573b] text-transparent bg-clip-text">
                    Optimiza tu CV para conseguir tu{' '}
                    <span className="relative inline-block font-bold bg-gradient-to-r from-[#ce270a] to-[#f4573b] text-transparent bg-clip-text font-sans transition-transform duration-300 hover:scale-110 hover:drop-shadow-lg">
                        DreamJob
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#ce270a] to-[#f4573b] transform scale-x-0 transition-transform duration-300 origin-left hover:scale-x-100"></span>
                    </span>
                </span>
            </h1>
            
            <div className="w-full max-w-4xl flex flex-col items-center">
                <CVUpload setCvFile={setCvFile} />
                <JobURLInput setJobUrl={setJobUrl} />
                
                <div className="w-full flex justify-center my-6">
                    <AnalyzeButton cvFile={cvFile} jobUrl={jobUrl} setResult={setResult} />
                </div>
            </div>
            
            <ResultsDisplay result={result} originalCV={cvFile} />
        </div>
    );
};
export default Page;