/**
 * Dashboard routes.
 * Maps /api/dashboard endpoints to dashboard controllers: aggregate stats,
 * live/recent/upcoming matches, and top player leaderboards.
 */
import express from 'express'
import {getAllStats,getLiveMatches,getRecentMatches,getUpcomingMatches,getTopPlayers} from '../controllers/dashboard.controller.js'
const router=express.Router()

router.get('/stats',getAllStats)
router.get('/live-matches',getLiveMatches)
router.get('/recent-matches',getRecentMatches)
router.get('/upcoming-matches',getUpcomingMatches)
router.get('/top-players',getTopPlayers)

export default router