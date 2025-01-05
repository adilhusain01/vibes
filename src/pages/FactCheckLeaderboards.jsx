import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "../api/axios";
import { CircularProgress } from "@mui/material";
import { Search, Trophy, Users, HelpCircle, SortAsc } from "lucide-react";

const FactCheckLeaderBoards = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [factCheck, setFactCheck] = useState(null);
    const [participants, setParticipants] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOption, setSortOption] = useState("name");
    const [allParticipants, setAllParticipants] = useState([]);

    useEffect(() => {
        const fetchLeaderBoards = async () => {
            try {
                let response = await axios.get(`/api/fact-check/leaderboards/${id}`);
                if (!response || !response.data) {
                    throw new Error("Failed to fetch fact check leaderboard data");
                }
                setFactCheck(response.data.factCheck);
                setParticipants(response.data.participants || []);
                setAllParticipants(response.data.participants || []);
                console.log(response.data);
            } catch (error) {
                console.log(error);
                toast.error("Failed to fetch leaderboard data");
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderBoards();
    }, [id]);

    const handleSortChange = (e) => {
        setSortOption(e.target.value);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        if (e.target.value.trim() === "") {
            setParticipants(allParticipants);
        } else {
            const filteredParticipants = allParticipants.filter((participant) =>
            participant.participantName
            .toLowerCase()
            .includes(e.target.value.toLowerCase())
            );
            setParticipants(filteredParticipants);
        }
    };

    const sortedParticipants = [...participants].sort((a, b) => {
        if (sortOption === "name") {
            return a.participantName.localeCompare(b.participantName);
        } else if (sortOption === "score") {
            return b.score - a.score;
        }
        return 0;
    });

    if (loading) {
        return (
            <div
            className="flex items-center justify-center"
            style={{ height: "calc(100vh - 6rem)" }}
            >
            <CircularProgress sx={{ color: "white" }} />
            </div>
        );
    }

    if (!factCheck) {
        return (
            <div
            className="flex items-center justify-center"
            style={{ height: "calc(100vh - 6rem)" }}
            >
            <h1 className="text-2xl md:text-4xl font-bold text-white">
            Fact Check not found!
            </h1>
            </div>
        );
    }

    return (
        <div
        className="flex items-center justify-center"
        style={{ height: "calc(100vh - 6rem)" }}
        >
        <div className="max-w-4xl w-full mx-auto px-4">
        <div className="text-center space-y-4 mb-8">
        <h1 className="text-2xl md:text-5xl font-bold text-white">
        Fact Check Leaderboard &nbsp;
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-pink-400">
        #{id}
        </span>
        </h1>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 md:p-8 border border-white/20 shadow-xl space-y-6">
        {/* Fact Check Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex flex-row md:flex-col items-center justify-between md:items-start md:justify-start bg-white/5 p-3 md:p-4 rounded-xl border border-white/10">
        <div className="flex items-center gap-2 text-white">
        <HelpCircle size={20} />
        <span className="text-sm font-medium">Facts</span>
        </div>
        <p className="text-xl md:text-2xl font-bold text-red-400 md:mt-2">
        {factCheck.facts.length}
        </p>
        </div>

        <div className="flex flex-row md:flex-col items-center justify-between md:items-start md:justify-start bg-white/5 p-3 md:p-4 rounded-xl border border-white/10">
        <div className="flex items-center gap-2 text-white">
        <Users size={20} />
        <span className="text-sm font-medium">Participants</span>
        </div>
        <p className="text-2xl md:text-2xl font-bold text-red-400 md:mt-2">
        {participants.length}
        </p>
        </div>

        <div className="flex flex-row md:flex-col items-center justify-between md:items-start md:justify-start bg-white/5 p-3 p-4 rounded-xl border border-white/10">
        <div className="flex items-center gap-2 text-white">
        <Trophy size={20} />
        <span className="text-sm font-medium">Status</span>
        </div>
        <p
        className={`text-lg md:text-2xl font-bold md:mt-2 ${
            factCheck.isPublic ? "text-green-400" : "text-pink-400"
        }`}
        >
        {factCheck.isPublic ? "Open" : "Closed"}
        </p>
        </div>
        </div>

        {/* Search and Sort Controls */}
        <div className="hidden md:flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-auto">
        <input
        type="text"
        placeholder="Search participants..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="w-full md:w-64 px-4 py-2 md:py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-red-200 focus:outline-none focus:ring-2 focus:ring-red-400 pl-10"
        />
        <Search
        className="absolute left-3 top-3.5 text-red-400"
        size={20}
        />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
        <SortAsc size={20} className="text-red-400" />
        <select
        value={sortOption}
        onChange={handleSortChange}
        className="w-full md:w-auto px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-red-400 appearance-none cursor-pointer"
        >
        <option value="name">Sort by Name</option>
        <option value="score">Sort by Score</option>
        </select>
        </div>
        </div>

        {/* Participants List */}
        <div className="space-y-2 mt-6">
        {sortedParticipants.map((participant, index) => (
            <div
            key={participant.walletAddress}
            className="flex items-center justify-between p-3 md:p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors"
            >
            <div className="flex items-center gap-4">
            <span className="text-red-400 font-medium">{index + 1}</span>
            <div className="flex items-center gap-2">
            <span className="text-white">
            {participant.participantName}
            </span>
            </div>
            </div>
            <span className="text-pink-400 font-bold">
            {participant.score}
            </span>
            </div>
        ))}
        </div>
        </div>
        </div>
        </div>
    );
};

export default FactCheckLeaderBoards;
