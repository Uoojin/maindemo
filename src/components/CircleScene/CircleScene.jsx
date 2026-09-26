import { useEffect, useRef } from 'react';
import './CircleScene.css';

export default function CircleScene({ active }) {
  const rootRef = useRef(null);
  const activeRef = useRef(active);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    let disposed = false;
    let rafId = 0;

          var canvas = root.querySelector('#scene');
          var ctx = canvas.getContext('2d');
    
          var COLOR_INK = '#0b0b0a';
          var COLOR_ACCENT = '#29e0c4';
          var COLOR_ACCENT_STRONG = '#0fb79d';
          var MAJOR_COLORS = {
            planning: '#FFE6FA',
            design: '#FFFBD2',
            programming: '#EBE6FF'
          };
          var MAJORS = ['planning', 'design', 'programming'];
          var TEAM_COUNT = 17;
          var STUDENT_COUNT = 113;
          var TEAM_SIZES = [7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 6, 6, 6, 6, 6, 6];
          var STUDENT_RADIUS = 9;
          var TEAM_INFO = [
            { name: 'TEAM 01', category: '프로젝트 카테고리' },
            { name: 'TEAM 02', category: '프로젝트 카테고리' },
            { name: 'TEAM 03', category: '프로젝트 카테고리' },
            { name: 'TEAM 04', category: '프로젝트 카테고리' },
            { name: 'TEAM 05', category: '프로젝트 카테고리' },
            { name: 'TEAM 06', category: '프로젝트 카테고리' },
            { name: 'TEAM 07', category: '프로젝트 카테고리' },
            { name: 'TEAM 08', category: '프로젝트 카테고리' },
            { name: 'TEAM 09', category: '프로젝트 카테고리' },
            { name: 'TEAM 10', category: '프로젝트 카테고리' },
            { name: 'TEAM 11', category: '프로젝트 카테고리' },
            { name: 'TEAM 12', category: '프로젝트 카테고리' },
            { name: 'TEAM 13', category: '프로젝트 카테고리' },
            { name: 'TEAM 14', category: '프로젝트 카테고리' },
            { name: 'TEAM 15', category: '프로젝트 카테고리' },
            { name: 'TEAM 16', category: '프로젝트 카테고리' },
            { name: 'TEAM 17', category: '프로젝트 카테고리' }
          ];
    
          var reduceMotion = false;
          try {
            reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          } catch (e) { }
    
          var dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2.5));
          var W = 0, H = 0, WORLD_W = 0, WORLD_H = 0;
    
          var BLOB_ANCHORS = [
            [0.08, 0.10], [0.28, 0.08], [0.50, 0.11], [0.72, 0.08], [0.92, 0.12],
            [0.15, 0.36], [0.38, 0.33], [0.62, 0.37], [0.86, 0.34],
            [0.08, 0.64], [0.29, 0.68], [0.52, 0.63], [0.74, 0.69], [0.93, 0.62],
            [0.18, 0.91], [0.50, 0.88], [0.82, 0.92]
          ];
    
          function resize() {
            W = root.clientWidth;
            H = root.clientHeight;
            WORLD_W = Math.max(W * 2.65, W + 1300);
            WORLD_H = Math.max(H * 2.35, H + 980);
            canvas.width = Math.round(W * dpr);
            canvas.height = Math.round(H * dpr);
            canvas.style.width = W + 'px';
            canvas.style.height = H + 'px';
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
          }
    
          var nodes = [];
          var blobs = [];
          var camera = { x: 0, y: 0, targetX: 0, targetY: 0 };
          var mouse = { x: W / 2, y: H / 2, worldX: 0, worldY: 0, active: false };
          var draggingNode = null;
          var draggingBlob = null;
          var draggingTeamNodes = null;
          var draggingTeamLastX = 0;
          var draggingTeamLastY = 0;
          var dragOffset = { x: 0, y: 0 };
          var hoveredNode = null;
          var hoveredTeam = null;
          var labelBounds = [];
          var connections = new Map();
          var syncLink = null;
          var lastSyncAt = -999;
          var syncSourceNode = null;
          var syncTargetNode = null;
          var syncTargetStrength = 0;
          var syncEvent = null;
          var syncSerial = 0;
    
          function fract(v) {
            return v - Math.floor(v);
          }
    
          function seeded(index, salt) {
            return fract(Math.sin(index * 127.1 + salt * 311.7) * 43758.5453123);
          }
    
          function hexToRgba(hex, alpha) {
            var clean = hex.replace('#', '');
            var r = parseInt(clean.slice(0, 2), 16);
            var g = parseInt(clean.slice(2, 4), 16);
            var b = parseInt(clean.slice(4, 6), 16);
            return 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
          }
    
          function layout() {
            if (nodes.length === 0) {
              blobs = [];
              for (var t = 0; t < TEAM_COUNT; t++) {
                var anchor = BLOB_ANCHORS[t];
                var cx = WORLD_W * anchor[0];
                var cy = WORLD_H * anchor[1];
                var coreRadius = 160 + (t % 4) * 7 + seeded(t + 1, 12) * 18;
                var orbitGap = 23 + seeded(t + 1, 16) * 5;
                var ellipseScale = 0.97 + seeded(t + 1, 17) * 0.05;
                var orbitRadii = [
                  { x: coreRadius + orbitGap, y: (coreRadius + orbitGap) * ellipseScale },
                  { x: coreRadius + orbitGap * 2, y: (coreRadius + orbitGap * 2) * ellipseScale },
                  { x: coreRadius + orbitGap * 3, y: (coreRadius + orbitGap * 3) * ellipseScale }
                ];
                blobs.push({
                  id: t,
                  team: t,
                  anchorX: anchor[0],
                  anchorY: anchor[1],
                  baseX: cx,
                  baseY: cy,
                  currentX: cx,
                  currentY: cy,
                  coreRadius: coreRadius,
                  renderRadius: coreRadius,
                  orbitRadii: orbitRadii,
                  outerRadius: Math.max(orbitRadii[2].x, orbitRadii[2].y) + STUDENT_RADIUS,
                  info: TEAM_INFO[t],
                  hoverAmount: 0,
                  phase: seeded(t + 1, 13) * Math.PI * 2,
                  speed: 0.055 + seeded(t + 1, 14) * 0.055,
                  z: 0.65 + seeded(t + 1, 15) * 0.35,
                  travelSpeed: 6 + seeded(t + 1, 40) * 10,
                  velocityX: Math.cos(seeded(t + 1, 41) * Math.PI * 2) * (6 + seeded(t + 1, 40) * 10),
                  velocityY: Math.sin(seeded(t + 1, 41) * Math.PI * 2) * (6 + seeded(t + 1, 40) * 10),
                  targetX: cx,
                  targetY: cy,
                  waypointIndex: 0,
                  waypointAge: 999,
                  waypointDuration: 55 + seeded(t + 1, 42) * 35,
                  dragTargetX: null,
                  dragTargetY: null,
                  syncEnergy: 0,
                  syncSeed: seeded(t + 1, 71),
                  syncStyle: t % 6,
                  syncSourceAngle: 0,
                  syncCooldown: 0,
                  syncPalette: 0,
                  syncVariant: 0,
                  syncSpin: 1,
                  syncStart: -999,
                  syncRotation: 0
                });
              }
    
              var teamIndex = 0;
              var teamCursor = 0;
              nodes = [];
    
              for (var i = 0; i < STUDENT_COUNT; i++) {
                while (i >= teamCursor + TEAM_SIZES[teamIndex]) {
                  teamCursor += TEAM_SIZES[teamIndex];
                  teamIndex++;
                }
    
                var team = blobs[teamIndex];
                var minRadius = team.coreRadius + 18;
                var maxRadius = team.outerRadius + 8;
                var localX = 0;
                var localY = 0;
                var placed = false;
    
                for (var attempt = 0; attempt < 24 && !placed; attempt++) {
                  var angle = seeded(i + 1, 31 + attempt * 2) * Math.PI * 2;
                  var distance = minRadius + seeded(i + 1, 32 + attempt * 2) * (maxRadius - minRadius);
                  localX = Math.cos(angle) * distance;
                  localY = Math.sin(angle) * distance;
                  placed = nodes.every(function (other) {
                    if (other.team !== teamIndex) return true;
                    return Math.hypot(localX - other.homeLocalX, localY - other.homeLocalY) > STUDENT_RADIUS * 3.4;
                  });
                }
    
                nodes.push({
                  idx: i,
                  id: i + 1,
                  team: teamIndex,
                  major: MAJORS[i % MAJORS.length],
                  r: STUDENT_RADIUS,
                  z: 0.55 + seeded(i + 1, 7) * 0.45,
                  minRadius: minRadius,
                  maxRadius: maxRadius,
                  homeLocalX: localX,
                  homeLocalY: localY,
                  homeRadius: distance,
                  orbitAngle: angle,
                  orbitSpeed: 0.09 + seeded(i + 1, 20) * 0.09,
                  orbitDirection: seeded(i + 1, 21) < 0.70 ? 1 : -1,
                  driftPhase: seeded(i + 1, 10) * Math.PI * 2,
                  driftSpeed: 0.10 + seeded(i + 1, 11) * 0.09,
                  driftAmount: 2.5 + seeded(i + 1, 18) * 3.5,
                  angularDrift: 0.016 + seeded(i + 1, 19) * 0.024,
                  x: team.currentX + localX,
                  y: team.currentY + localY,
                  scale: 1,
                  pulses: [],
                  freeDragX: null,
                  freeDragY: null,
                  returning: false,
                  returnX: 0,
                  returnY: 0,
                  returnVX: 0,
                  returnVY: 0,
                  syncRole: null,
                  syncVisual: 0
                });
              }
            } else {
              blobs.forEach(function (blob) {
                blob.baseX = WORLD_W * blob.anchorX;
                blob.baseY = WORLD_H * blob.anchorY;
                blob.currentX = blob.baseX;
                blob.currentY = blob.baseY;
                blob.waypointAge = 999;
              });
            }
            camera.x = Math.max(0, Math.min(WORLD_W - W, (WORLD_W - W) * 0.5));
            camera.y = Math.max(0, Math.min(WORLD_H - H, (WORLD_H - H) * 0.5));
            camera.targetX = camera.x;
            camera.targetY = camera.y;
          }
    
          function getTeamMembers(team) {
            return nodes.filter(function (n) { return n.team === team; });
          }
    
          function screenToWorld(p) {
            return { x: p.x + camera.x, y: p.y + camera.y };
          }
    
          function pointerPos(evt) {
            var rect = canvas.getBoundingClientRect();
            var cx = (evt.touches ? evt.touches[0].clientX : evt.clientX) - rect.left;
            var cy = (evt.touches ? evt.touches[0].clientY : evt.clientY) - rect.top;
            return { x: cx, y: cy };
          }
    
          canvas.addEventListener('pointerdown', function (e) {
            var p = pointerPos(e);
            var w = screenToWorld(p);
            mouse.x = p.x; mouse.y = p.y; mouse.worldX = w.x; mouse.worldY = w.y; mouse.active = true;
    
            var hit = null, best = 1e9;
            for (var i = 0; i < nodes.length; i++) {
              var n = nodes[i];
              var d = Math.hypot(w.x - n.x, w.y - n.y);
              if (d < n.r + 14 && d < best) {
                best = d;
                hit = n;
              }
            }
    
            if (hit) {
              draggingNode = hit;
              canvas.setPointerCapture(e.pointerId);
              return;
            }
    
            var blobHit = null;
            best = 1e9;
            for (var b = 0; b < blobs.length; b++) {
              var blob = blobs[b];
              var bd = Math.hypot(w.x - blob.currentX, w.y - blob.currentY);
              if (bd < blob.renderRadius && bd < best) {
                best = bd;
                blobHit = blob;
              }
            }
    
            if (blobHit) {
              draggingBlob = blobHit;
              dragOffset.x = blobHit.currentX - w.x;
              dragOffset.y = blobHit.currentY - w.y;
              canvas.setPointerCapture(e.pointerId);
    
            }
          });
    
          canvas.addEventListener('pointermove', function (e) {
            var p = pointerPos(e);
            var w = screenToWorld(p);
            mouse.x = p.x; mouse.y = p.y; mouse.worldX = w.x; mouse.worldY = w.y; mouse.active = true;
    
            if (draggingNode) {
              // A follows the pointer exactly.
              draggingNode.x = w.x;
              draggingNode.y = w.y;
              draggingNode.freeDragX = w.x;
              draggingNode.freeDragY = w.y;
    
              // Every teammate follows A while preserving the team's relative layout.
              // A small interpolation makes them feel pulled by A rather than welded to it.
              if (draggingTeamNodes) {
                for (var dmi = 0; dmi < draggingTeamNodes.length; dmi++) {
                  var mn = draggingTeamNodes[dmi];
                  if (mn === draggingNode) continue;
    
                  var targetX = w.x + (mn.teamDragOffsetX || 0);
                  var targetY = w.y + (mn.teamDragOffsetY || 0);
    
                  mn.x += (targetX - mn.x) * 0.34;
                  mn.y += (targetY - mn.y) * 0.34;
                  mn.freeDragX = mn.x;
                  mn.freeDragY = mn.y;
                }
              }
    
              draggingTeamLastX = w.x;
              draggingTeamLastY = w.y;
            } else if (draggingBlob) {
              draggingBlob.dragTargetX = w.x + dragOffset.x;
              draggingBlob.dragTargetY = w.y + dragOffset.y;
            }
          });
    
          function endDrag(e) {
            if (draggingNode) {
              var n = draggingNode;
              n.pulses.push({ t: 0 });
              var heldBySync = syncEvent && (syncEvent.a === n || syncEvent.b === n) &&
                ((performance.now() - start) / 1000 - syncEvent.born) < syncEvent.duration;
              n.returning = !heldBySync;
              n.returnX = n.x;
              n.returnY = n.y;
              n.returnVX = 0;
              n.returnVY = 0;
              n.freeDragX = null;
              n.freeDragY = null;
              // All non-synced teammates spring back to their own original team orbits.
              if (draggingTeamNodes) {
                for (var dri = 0; dri < draggingTeamNodes.length; dri++) {
                  var rn = draggingTeamNodes[dri];
                  var heldByPair = syncEvent && (syncEvent.a === rn || syncEvent.b === rn) &&
                    ((performance.now() - start) / 1000 - syncEvent.born) < syncEvent.duration;
                  if (!heldByPair) {
                    rn.returning = true;
                    rn.returnX = rn.x;
                    rn.returnY = rn.y;
                    rn.returnVX = 0;
                    rn.returnVY = 0;
                  }
                  rn.freeDragX = null;
                  rn.freeDragY = null;
                  rn.teamDragOffsetX = null;
                  rn.teamDragOffsetY = null;
                }
              }
              try { canvas.releasePointerCapture(e.pointerId); } catch (err) { }
              draggingNode = null;
              draggingTeamNodes = null;
            }
    
            if (draggingBlob) {
              draggingBlob.baseX = draggingBlob.currentX;
              draggingBlob.baseY = draggingBlob.currentY;
              draggingBlob.dragTargetX = null;
              draggingBlob.dragTargetY = null;
              draggingBlob.velocityX *= 0.25;
              draggingBlob.velocityY *= 0.25;
              draggingBlob.waypointAge = 999;
              try { canvas.releasePointerCapture(e.pointerId); } catch (err) { }
              draggingBlob = null;
            }
          }
    
          canvas.addEventListener('pointerup', endDrag);
          canvas.addEventListener('pointercancel', endDrag);
          canvas.addEventListener('pointerleave', function () {
            mouse.active = false;
            hoveredNode = null;
            hoveredTeam = null;
          });
    
          var start = performance.now();
          var last = start;
    
          function updateCamera() {
            var maxX = Math.max(0, WORLD_W - W);
            var maxY = Math.max(0, WORLD_H - H);
            // When SYNC is active, the camera automatically turns toward the interaction.
            // Focus on the midpoint of the two participating team systems.
            var syncCameraActive = false;
            if (syncEvent) {
              var syncAge = (performance.now() - start) / 1000 - syncEvent.born;
              if (syncAge >= 0 && syncAge <= syncEvent.duration) {
                var focusX = (syncEvent.teamA.currentX + syncEvent.teamB.currentX) * 0.5;
                var focusY = (syncEvent.teamA.currentY + syncEvent.teamB.currentY) * 0.5;
    
                camera.targetX = Math.max(0, Math.min(maxX, focusX - W * 0.5));
                camera.targetY = Math.max(0, Math.min(maxY, focusY - H * 0.5));
                syncCameraActive = true;
              }
            }
    
            if (!syncCameraActive) {
              if (mouse.active && !reduceMotion) {
                camera.targetX = Math.max(0, Math.min(maxX, (mouse.x / Math.max(1, W)) * maxX));
                camera.targetY = Math.max(0, Math.min(maxY, (mouse.y / Math.max(1, H)) * maxY));
              } else {
                camera.targetX = maxX * 0.5;
                camera.targetY = maxY * 0.5;
              }
            }
    
            // Faster than the normal camera drift during SYNC, but still eased so
            // the viewport glides toward the interaction rather than snapping.
            var cameraEase = syncCameraActive ? 0.032 : 0.0065;
            camera.x += (camera.targetX - camera.x) * cameraEase;
            camera.y += (camera.targetY - camera.y) * cameraEase;
          }
    
          function syncDraggedObject() {
            if (draggingNode) {
              draggingNode.x = mouse.worldX;
              draggingNode.y = mouse.worldY;
              draggingNode.freeDragX = mouse.worldX;
              draggingNode.freeDragY = mouse.worldY;
    
              if (draggingTeamNodes) {
                for (var dm2 = 0; dm2 < draggingTeamNodes.length; dm2++) {
                  var mn2 = draggingTeamNodes[dm2];
                  if (mn2 === draggingNode) continue;
    
                  var targetX2 = mouse.worldX + (mn2.teamDragOffsetX || 0);
                  var targetY2 = mouse.worldY + (mn2.teamDragOffsetY || 0);
    
                  mn2.x += (targetX2 - mn2.x) * 0.34;
                  mn2.y += (targetY2 - mn2.y) * 0.34;
                  mn2.freeDragX = mn2.x;
                  mn2.freeDragY = mn2.y;
                }
              }
    
              draggingTeamLastX = mouse.worldX;
              draggingTeamLastY = mouse.worldY;
            } else if (draggingBlob) {
              draggingBlob.dragTargetX = mouse.worldX + dragOffset.x;
              draggingBlob.dragTargetY = mouse.worldY + dragOffset.y;
            }
          }
    
          function setNodeLocalPosition(node, worldX, worldY) {
            var team = blobs[node.team];
            var localX = worldX - team.currentX;
            var localY = worldY - team.currentY;
            var distance = Math.hypot(localX, localY);
            var angle = distance > 0.001 ? Math.atan2(localY, localX) : 0;
            var clampedDistance = Math.max(node.minRadius, Math.min(node.maxRadius, distance));
            node.homeRadius = clampedDistance;
            node.orbitAngle = angle;
            node.homeLocalX = Math.cos(angle) * clampedDistance;
            node.homeLocalY = Math.sin(angle) * clampedDistance;
            node.x = team.currentX + node.homeLocalX;
            node.y = team.currentY + node.homeLocalY;
          }
    
          function chooseNextTeamTarget(b) {
            b.waypointIndex++;
            var margin = b.outerRadius + 42;
            var availableW = Math.max(1, WORLD_W - margin * 2);
            var availableH = Math.max(1, WORLD_H - margin * 2);
            var seedIndex = (b.id + 1) * 37 + b.waypointIndex * 11;
            b.targetX = margin + seeded(seedIndex, 51) * availableW;
            b.targetY = margin + seeded(seedIndex, 52) * availableH;
            b.waypointAge = 0;
            b.waypointDuration = 55 + seeded(seedIndex, 53) * 35;
          }
    
          function updateTeamPosition(b, t, dt) {
            var wob = reduceMotion ? 0.12 : 1;
    
            var breathe =
              Math.sin(t * (0.34 + b.speed * 0.75) + b.phase) * 0.105 +
              Math.sin(t * (0.15 + b.speed * 0.32) + b.phase * 1.7) * 0.035;
            var r = b.coreRadius * (1 + breathe * wob);
    
            if (draggingBlob === b && b.dragTargetX !== null) {
              b.currentX = b.dragTargetX;
              b.currentY = b.dragTargetY;
              b.velocityX *= 0.92;
              b.velocityY *= 0.92;
            } else if (b.dragTargetX !== null) {
              b.currentX += (b.dragTargetX - b.currentX) * 0.10;
              b.currentY += (b.dragTargetY - b.currentY) * 0.10;
            } else {
              b.waypointAge += dt;
              var targetDX = b.targetX - b.currentX;
              var targetDY = b.targetY - b.currentY;
              var targetDistance = Math.hypot(targetDX, targetDY);
              if (b.waypointAge >= b.waypointDuration || targetDistance < b.outerRadius * 0.72) {
                chooseNextTeamTarget(b);
                targetDX = b.targetX - b.currentX;
                targetDY = b.targetY - b.currentY;
                targetDistance = Math.hypot(targetDX, targetDY);
              }
    
              var desiredX = targetDistance > 0.001 ? targetDX / targetDistance * b.travelSpeed : 0;
              var desiredY = targetDistance > 0.001 ? targetDY / targetDistance * b.travelSpeed : 0;
              var safeMargin = b.outerRadius + 18;
              var steerZone = b.outerRadius * 0.7 + 90;
    
              if (b.currentX < safeMargin + steerZone) {
                desiredX += (1 - Math.max(0, b.currentX - safeMargin) / steerZone) * b.travelSpeed;
              } else if (b.currentX > WORLD_W - safeMargin - steerZone) {
                desiredX -= (1 - Math.max(0, WORLD_W - safeMargin - b.currentX) / steerZone) * b.travelSpeed;
              }
              if (b.currentY < safeMargin + steerZone) {
                desiredY += (1 - Math.max(0, b.currentY - safeMargin) / steerZone) * b.travelSpeed;
              } else if (b.currentY > WORLD_H - safeMargin - steerZone) {
                desiredY -= (1 - Math.max(0, WORLD_H - safeMargin - b.currentY) / steerZone) * b.travelSpeed;
              }
    
              var desiredLength = Math.hypot(desiredX, desiredY);
              if (desiredLength > b.travelSpeed) {
                desiredX = desiredX / desiredLength * b.travelSpeed;
                desiredY = desiredY / desiredLength * b.travelSpeed;
              }
    
              var steering = Math.min(1, dt * 0.24);
              b.velocityX += (desiredX - b.velocityX) * steering;
              b.velocityY += (desiredY - b.velocityY) * steering;
              var globalMotion = reduceMotion ? 0.18 : 1;
              b.currentX += b.velocityX * dt * globalMotion;
              b.currentY += b.velocityY * dt * globalMotion;
    
              b.currentX = Math.max(safeMargin, Math.min(WORLD_W - safeMargin, b.currentX));
              b.currentY = Math.max(safeMargin, Math.min(WORLD_H - safeMargin, b.currentY));
            }
    
            b.renderRadius = Math.max(b.coreRadius * 0.85, Math.min(b.coreRadius * 1.15, r));
          }
    
          // During SYNC, the two participating team systems gently pull closer together.
          // This only affects the SYNC motion; all other movement/design stays unchanged.
          function attractSyncTeams(t, dt) {
            if (!syncEvent) return;
    
            var age = t - syncEvent.born;
            if (age < 0 || age > syncEvent.duration) return;
    
            var a = syncEvent.teamA;
            var b = syncEvent.teamB;
            if (!a || !b || a === b) return;
    
            var dx = b.currentX - a.currentX;
            var dy = b.currentY - a.currentY;
            var distance = Math.hypot(dx, dy);
            if (distance < 0.001) return;
    
            // Start pulling shortly after the student circles connect,
            // then smoothly release near the end of the SYNC.
            var pullIn = Math.min(1, Math.max(0, (age - 0.10) / 0.65));
            var pullOut = Math.min(1, Math.max(0, (syncEvent.duration - age) / 0.70));
            var strength = pullIn * pullOut;
            if (strength <= 0) return;
    
            var nx = dx / distance;
            var ny = dy / distance;
    
            // Let the two large circles/orbit systems come visibly closer,
            // but do not collapse into one another.
            var desiredDistance = (a.renderRadius + b.renderRadius) * 1.02;
            var excess = distance - desiredDistance;
            if (excess <= 0) return;
    
            var move = Math.min(excess * 0.075, 4.8) * strength * Math.min(1, dt * 60);
    
            // Once the two team systems come close, orbit them around their SHARED midpoint.
            // The whole team system moves as one body; it does not independently spin in place.
            var orbitFadeIn = Math.min(1, Math.max(0, (age - 0.38) / 0.42));
            var orbitFadeOut = Math.min(1, Math.max(0, (syncEvent.duration - age) / 0.28));
            var orbitStrength = Math.max(0, Math.min(orbitFadeIn, orbitFadeOut));
    
            if (orbitStrength > 0.001) {
              if (!syncEvent.teamOrbitReady) {
                syncEvent.teamOrbitReady = true;
                syncEvent.teamOrbitAngle = Math.atan2(
                  b.currentY - a.currentY,
                  b.currentX - a.currentX
                );
              }
    
              var midX = (a.currentX + b.currentX) * 0.5;
              var midY = (a.currentY + b.currentY) * 0.5;
              var pairDistance = Math.hypot(
                b.currentX - a.currentX,
                b.currentY - a.currentY
              );
    
              // Keep the two complete systems close while they circle each other.
              var orbitRadius = Math.max(
                (a.renderRadius + b.renderRadius) * 0.54,
                pairDistance * 0.5
              );
    
              syncEvent.teamOrbitAngle += dt * 2.15 * (syncEvent.spin || 1) * orbitStrength;
    
              var oa = syncEvent.teamOrbitAngle;
              var targetAX = midX - Math.cos(oa) * orbitRadius;
              var targetAY = midY - Math.sin(oa) * orbitRadius;
              var targetBX = midX + Math.cos(oa) * orbitRadius;
              var targetBY = midY + Math.sin(oa) * orbitRadius;
    
              var orbitFollow = Math.min(1, dt * 7.5) * orbitStrength;
              a.currentX += (targetAX - a.currentX) * orbitFollow;
              a.currentY += (targetAY - a.currentY) * orbitFollow;
              b.currentX += (targetBX - b.currentX) * orbitFollow;
              b.currentY += (targetBY - b.currentY) * orbitFollow;
            }
    
            // Keep the orbit/student layout itself stable: the visible rotation now comes
            // from the TWO complete team systems revolving around each other.
            a.syncRotation = 0;
            b.syncRotation = 0;
    
            var aPinned = draggingBlob === a || a.dragTargetX !== null;
            var bPinned = draggingBlob === b || b.dragTargetX !== null;
    
            if (aPinned && !bPinned) {
              b.currentX -= nx * move * 2;
              b.currentY -= ny * move * 2;
            } else if (bPinned && !aPinned) {
              a.currentX += nx * move * 2;
              a.currentY += ny * move * 2;
            } else {
              a.currentX += nx * move;
              a.currentY += ny * move;
              b.currentX -= nx * move;
              b.currentY -= ny * move;
            }
          }
    
          function relaxSyncRotations(dt) {
            for (var i = 0; i < blobs.length; i++) {
              var b = blobs[i];
              var active = syncEvent && (syncEvent.teamA === b || syncEvent.teamB === b) &&
                ((performance.now() - start) / 1000 - syncEvent.born) <= syncEvent.duration;
              if (!active) {
                b.syncRotation = (b.syncRotation || 0) * Math.pow(0.08, dt);
                if (Math.abs(b.syncRotation) < 0.0001) b.syncRotation = 0;
              }
            }
          }
    
          function separateBlobs() {
            for (var pass = 0; pass < 2; pass++) {
              for (var i = 0; i < blobs.length; i++) {
                for (var j = i + 1; j < blobs.length; j++) {
                  var a = blobs[i];
                  var b = blobs[j];
                  var dx = b.currentX - a.currentX;
                  var dy = b.currentY - a.currentY;
                  var distance = Math.hypot(dx, dy);
                  var orbitDistance = (a.outerRadius + b.outerRadius) * 0.72;
                  var coreDistance = (a.renderRadius + b.renderRadius) * 1.35;
                  var minDistance = Math.max(orbitDistance, coreDistance);
                  if (distance >= minDistance) continue;
    
                  if (distance < 0.001) {
                    dx = Math.cos((i + 1) * 1.7);
                    dy = Math.sin((j + 1) * 1.7);
                    distance = 1;
                  }
    
                  var nx = dx / distance;
                  var ny = dy / distance;
                  var overlap = minDistance - distance;
                  var aPinned = draggingBlob === a || a.dragTargetX !== null;
                  var bPinned = draggingBlob === b || b.dragTargetX !== null;
    
                  if (aPinned && !bPinned) {
                    b.currentX += nx * overlap;
                    b.currentY += ny * overlap;
                  } else if (bPinned && !aPinned) {
                    a.currentX -= nx * overlap;
                    a.currentY -= ny * overlap;
                  } else {
                    a.currentX -= nx * overlap * 0.5;
                    a.currentY -= ny * overlap * 0.5;
                    b.currentX += nx * overlap * 0.5;
                    b.currentY += ny * overlap * 0.5;
                  }
                }
              }
            }
          }
    
    
          function triggerTeamSync(teamA, teamB, nodeA, nodeB, t) {
            if (!teamA || !teamB || teamA === teamB) return;
            if (t - lastSyncAt < 0.55) return;
            lastSyncAt = t;
            syncSerial++;
    
            function assignRandomPhenomenon(team, salt) {
              // Recomputed every single SYNC: the same team never owns one fixed motion.
              var raw = Math.random();
              team.syncStyle = Math.floor(raw * 12) % 12;
              team.syncPalette = Math.floor(Math.random() * 8);
              team.syncVariant = Math.random();
              team.syncSpin = Math.random() < .5 ? -1 : 1;
              team.syncStart = t;
              team.syncEnergy = 1;
            }
    
            // Pattern motion must NOT appear before the students have visibly connected.
            // Store the randomized responses now, but activate them later in updateAndDrawSyncPair.
            function prepareRandomPhenomenon(team) {
              team.syncStyle = Math.floor(Math.random() * 12) % 12;
              team.syncPalette = Math.floor(Math.random() * 8);
              team.syncVariant = Math.random();
              team.syncSpin = Math.random() < .5 ? -1 : 1;
              team.syncEnergy = 0;
              team.syncStart = -999;
            }
            prepareRandomPhenomenon(teamA);
            prepareRandomPhenomenon(teamB);
            if (teamB.syncStyle === teamA.syncStyle && Math.random() < .8) {
              teamB.syncStyle = (teamB.syncStyle + 1 + Math.floor(Math.random() * 10)) % 12;
            }
    
            teamA.syncSourceAngle = Math.atan2(nodeA.y - teamA.currentY, nodeA.x - teamA.currentX);
            teamB.syncSourceAngle = Math.atan2(nodeB.y - teamB.currentY, nodeB.x - teamB.currentX);
    
            nodeA.pulses.push({ t: 0 });
            nodeB.pulses.push({ t: 0 });
            nodeA.syncRole = 'source';
            nodeB.syncRole = 'target';
            nodeA.syncVisual = 1;
            nodeB.syncVisual = 1;
    
            syncLink = { a: nodeA, b: nodeB, born: t, duration: 5.15 };
            syncEvent = {
              a: nodeA, b: nodeB,
              teamA: teamA, teamB: teamB,
              born: t, duration: 5.15,
              spin: Math.random() < .5 ? -1 : 1,
              phase: Math.random() * Math.PI * 2
            };
          }
    
          function updateSyncInteraction(t, dt) {
            for (var bi = 0; bi < blobs.length; bi++) {
              // Team-core visuals are activated explicitly AFTER the A/B student connection phase.
              if (!(syncEvent && syncEvent.patternStarted &&
                (syncEvent.teamA === blobs[bi] || syncEvent.teamB === blobs[bi]))) {
                blobs[bi].syncEnergy = Math.max(0, blobs[bi].syncEnergy - dt * 1.8);
              }
              blobs[bi].syncCooldown = Math.max(0, blobs[bi].syncCooldown - dt);
            }
    
            syncSourceNode = draggingNode || null;
            syncTargetNode = null;
            syncTargetStrength += (0 - syncTargetStrength) * Math.min(1, dt * 8);
    
            if (!draggingNode) return;
    
            var a = draggingNode;
            var nearest = null;
            var nearestDistance = 1e9;
            for (var i = 0; i < nodes.length; i++) {
              var b = nodes[i];
              if (b === a || b.team === a.team) continue;
              var d = Math.hypot(b.x - a.x, b.y - a.y);
              if (d < nearestDistance) {
                nearestDistance = d;
                nearest = b;
              }
            }
    
            var syncDistance = 70;
            if (nearest && nearestDistance < syncDistance) {
              syncTargetNode = nearest;
              var desiredTargetStrength = 1 - nearestDistance / syncDistance;
              syncTargetStrength += (desiredTargetStrength - syncTargetStrength) * Math.min(1, dt * 12);
              var teamA = blobs[a.team];
              var teamB = blobs[nearest.team];
              var proximity = 1 - nearestDistance / syncDistance;
              teamA.syncEnergy = Math.max(teamA.syncEnergy, proximity * 0.34);
              teamB.syncEnergy = Math.max(teamB.syncEnergy, proximity * 0.34);
    
              if (nearestDistance < Math.max(18, (a.r + nearest.r) * 1.15) &&
                teamA.syncCooldown <= 0 && teamB.syncCooldown <= 0) {
                triggerTeamSync(teamA, teamB, a, nearest, t);
                teamA.syncCooldown = 1.7;
                teamB.syncCooldown = 1.7;
              }
            }
          }
    
          function drawSyncLink(t) {
            if (!syncLink) return;
            var age = t - syncLink.born;
            if (age > syncLink.duration) {
              syncLink = null;
              return;
            }
    
            var p = age / syncLink.duration;
            var fade = Math.sin(Math.min(1, p) * Math.PI);
            var a = syncLink.a, b = syncLink.b;
            var ax = a.x - camera.x, ay = a.y - camera.y;
            var bx = b.x - camera.x, by = b.y - camera.y;
            var dx = bx - ax, dy = by - ay;
            var dist = Math.hypot(dx, dy) || 1;
            var nx = -dy / dist, ny = dx / dist;
            var bend = Math.sin(p * Math.PI * 2) * 12 * (1 - p);
            var cx = (ax + bx) * 0.5 + nx * bend;
            var cy = (ay + by) * 0.5 + ny * bend;
    
            ctx.save();
            ctx.lineCap = 'round';
            ctx.lineWidth = 1.0 + fade * 1.15;
            ctx.strokeStyle = 'rgba(41,224,196,' + (0.18 + fade * 0.58).toFixed(3) + ')';
            ctx.shadowColor = 'rgba(41,224,196,' + (fade * 0.42).toFixed(3) + ')';
            ctx.shadowBlur = 10 + fade * 12;
            ctx.beginPath();
            ctx.moveTo(ax, ay);
            ctx.quadraticCurveTo(cx, cy, bx, by);
            ctx.stroke();
    
            var travel = Math.min(1, p * 1.65);
            var omt = 1 - travel;
            var ex = omt * omt * ax + 2 * omt * travel * cx + travel * travel * bx;
            var ey = omt * omt * ay + 2 * omt * travel * cy + travel * travel * by;
            ctx.beginPath();
            ctx.arc(ex, ey, 2.5 + fade * 2.2, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255,255,255,' + (0.72 * fade).toFixed(3) + ')';
            ctx.fill();
            ctx.restore();
          }
    
          function clipTeamCircle(sx, sy, radius) {
            ctx.beginPath();
            ctx.arc(sx, sy, radius * 0.96, 0, Math.PI * 2);
            ctx.clip();
          }
    
          var PHENOMENON_PALETTES = [
            ['#ff006e', '#00f5d4', '#5b2cff', '#ffe600'],
            ['#ff3b00', '#ffd500', '#00c8ff', '#ff00b8'],
            ['#baff00', '#4b22ff', '#ff006a', '#00e8c6'],
            ['#ff00c8', '#00eaff', '#6a28ff', '#ffd900'],
            ['#ff4d00', '#00e3a5', '#173cff', '#ff008c'],
            ['#ffe100', '#00bfff', '#ff174f', '#5528ff'],
            ['#00d9ff', '#ff00c8', '#eaff00', '#00d58f'],
            ['#ff174f', '#00efb0', '#5426ff', '#ffc400']
          ];
    
          function phenomenonPalette(team) {
            return PHENOMENON_PALETTES[team.syncPalette % PHENOMENON_PALETTES.length];
          }
    
          function drawSyncBackground(t) {
            // Intentionally empty.
            // The white page background stays unchanged.
            // "Background change" belongs inside each active mint team core.
          }
    
          function drawTeamSyncMotion(team, sx, sy, radius, t) {
            // Absolutely no team-core motion until two student circles have actually connected.
            if (!syncEvent || !syncEvent.patternStarted ||
              (syncEvent.teamA !== team && syncEvent.teamB !== team)) return;
            var e = team.syncEnergy || 0;
            if (e < .012) return;
    
            var style = team.syncStyle % 12;
            var c = phenomenonPalette(team);
            var local = t - team.syncStart;
            var spin = team.syncSpin || 1;
            // Animate the EXISTING pattern itself more strongly.
            // No extra particles/trails/rings are layered on top.
            var phase = local * (3.35 + team.syncVariant * 2.35) * spin + team.phase;
            var kineticPulse = .5 + .5 * Math.sin(local * 5.4 + team.phase);
    
            ctx.save();
            clipTeamCircle(sx, sy, radius);
    
            // NO gradient base: flat, graphic color field.
            var baseColor = c[(style + 2) % 4];
            ctx.fillStyle = hexToRgba(baseColor, .96 * e);
            ctx.fillRect(sx - radius, sy - radius, radius * 2, radius * 2);
    
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
    
            if (style === 0) {
              // CLASSIC MOIRE — two dense eccentric ring systems.
              for (var layer = 0; layer < 2; layer++) {
                ctx.save(); ctx.translate(sx, sy);
                ctx.rotate((layer ? -.55 : .47) * phase);
                var ox = (layer ? 1 : -1) * radius * .17;
                var oy = Math.sin(phase * .55 + layer) * radius * .08;
                for (var rr = 3; rr < radius * 1.42; rr += 4.4) {
                  ctx.beginPath(); ctx.arc(ox, oy, rr, 0, Math.PI * 2);
                  ctx.strokeStyle = hexToRgba(layer ? c[0] : c[1], .88 * e);
                  ctx.lineWidth = 1.05; ctx.stroke();
                }
                ctx.restore();
              }
            } else if (style === 1) {
              // RADIAL OP ART — alternating saturated wedges.
              ctx.save(); ctx.translate(sx, sy); ctx.rotate(phase * .58);
              var wedges = 48;
              for (var w = 0; w < wedges; w++) {
                ctx.beginPath(); ctx.moveTo(0, 0);
                ctx.arc(0, 0, radius * 1.03, w * Math.PI * 2 / wedges, (w + 1) * Math.PI * 2 / wedges);
                ctx.closePath();
                ctx.fillStyle = hexToRgba(w % 2 ? c[0] : c[3], .94 * e);
                ctx.fill();
              }
              ctx.restore();
            } else if (style === 2) {
              // WAVY STRIPES — hard-edged optical vibration.
              ctx.save(); ctx.translate(sx, sy); ctx.rotate(Math.sin(phase * .3) * .5);
              for (var y = -radius * 1.2; y < radius * 1.2; y += 7) {
                ctx.beginPath();
                ctx.moveTo(-radius * 1.2, y);
                for (var x = -radius * 1.2; x <= radius * 1.2; x += 4) {
                  var yy = y + Math.sin(x * .065 + phase * 3.15 + y * .022) * (7 + kineticPulse * 5);
                  ctx.lineTo(x, yy);
                }
                ctx.lineTo(radius * 1.2, y + 5);
                for (var x2 = radius * 1.2; x2 >= -radius * 1.2; x2 -= 4) {
                  var yy2 = y + 5 + Math.sin(x2 * .065 + phase * 3.15 + y * .022) * (7 + kineticPulse * 5);
                  ctx.lineTo(x2, yy2);
                }
                ctx.closePath();
                ctx.fillStyle = hexToRgba((Math.floor((y + radius * 1.2) / 7) % 2) ? c[0] : c[1], .90 * e);
                ctx.fill();
              }
              ctx.restore();
            } else if (style === 3) {
              // CHECKER VORTEX — concentric checker sectors rotating.
              ctx.save(); ctx.translate(sx, sy); ctx.rotate(phase * .42);
              var sectors = 24;
              for (var ring = 0; ring < 11; ring++) {
                var r0 = radius * ring / 11, r1 = radius * (ring + 1) / 11;
                for (var s = 0; s < sectors; s++) {
                  var a0 = s * Math.PI * 2 / sectors + Math.sin(phase * 1.55 + ring * .45) * (.035 + kineticPulse * .055);
                  var a1 = (s + 1) * Math.PI * 2 / sectors;
                  ctx.beginPath(); ctx.arc(0, 0, r1, a0, a1);
                  ctx.arc(0, 0, r0, a1, a0, true); ctx.closePath();
                  ctx.fillStyle = hexToRgba((s + ring) % 2 ? c[0] : c[3], .94 * e);
                  ctx.fill();
                }
              }
              ctx.restore();
            } else if (style === 4) {
              // INTERFERENCE — two ring fields produce a clear moire interference.
              var centers = [
                [sx - radius * .22 * Math.cos(phase * .45), sy - radius * .10],
                [sx + radius * .22 * Math.sin(phase * .51), sy + radius * .10]
              ];
              ctx.fillStyle = hexToRgba(c[3], .96 * e); ctx.fillRect(sx - radius, sy - radius, radius * 2, radius * 2);
              for (var ci = 0; ci < 2; ci++) {
                for (var ir = 4; ir < radius * 1.38; ir += 5.1) {
                  ctx.beginPath(); ctx.arc(centers[ci][0], centers[ci][1], ir, 0, Math.PI * 2);
                  ctx.strokeStyle = hexToRgba(ci ? c[0] : c[1], .90 * e);
                  ctx.lineWidth = 1.05; ctx.stroke();
                }
              }
            } else if (style === 5) {
              // CONCENTRIC PULSE — hard color rings expand inward/outward.
              ctx.save(); ctx.translate(sx, sy);
              var shift = (local * .82) % 1;
              for (var pr = 18; pr >= 0; pr--) {
                var p = (pr + shift) / 18;
                var rad = radius * Math.min(1, p);
                ctx.beginPath(); ctx.arc(0, 0, rad, 0, Math.PI * 2);
                ctx.fillStyle = hexToRgba(c[pr % 4], .94 * e); ctx.fill();
              }
              ctx.restore();
            } else if (style === 6) {
              // ROTATING GRID — clipped hard-line grid with counter-rotation.
              ctx.save(); ctx.translate(sx, sy); ctx.rotate(phase * (.38 + kineticPulse * .12));
              ctx.strokeStyle = hexToRgba(c[0], .92 * e); ctx.lineWidth = 2;
              for (var gx = -radius * 1.5; gx <= radius * 1.5; gx += 10) {
                ctx.beginPath(); ctx.moveTo(gx, -radius * 1.5); ctx.lineTo(gx, radius * 1.5); ctx.stroke();
              }
              ctx.rotate(-phase * .76);
              ctx.strokeStyle = hexToRgba(c[1], .88 * e); ctx.lineWidth = 1.5;
              for (var gy = -radius * 1.5; gy <= radius * 1.5; gy += 11) {
                ctx.beginPath(); ctx.moveTo(-radius * 1.5, gy); ctx.lineTo(radius * 1.5, gy); ctx.stroke();
              }
              ctx.restore();
            } else if (style === 7) {
              // SPIRAL ILLUSION — many colored arms, no gradients.
              ctx.save(); ctx.translate(sx, sy); ctx.rotate(phase * (.45 + kineticPulse * .16));
              for (var arm = 0; arm < 18; arm++) {
                ctx.beginPath();
                for (var st = 0; st < 70; st++) {
                  var p2 = st / 69;
                  var aa = arm * Math.PI * 2 / 18 + p2 * Math.PI * 2.1;
                  var sr = p2 * radius * .96;
                  var px = Math.cos(aa) * sr, py = Math.sin(aa) * sr;
                  if (st === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
                }
                ctx.strokeStyle = hexToRgba(c[arm % 4], .90 * e);
                ctx.lineWidth = 2.2; ctx.stroke();
              }
              ctx.restore();
            } else if (style === 8) {
              // OFFSET CIRCLES — classic kinetic moire discs.
              ctx.save(); ctx.translate(sx, sy); ctx.rotate(-phase * .38);
              for (var oc = 0; oc < 28; oc++) {
                var oa = oc * Math.PI * 2 / 28;
                var ox2 = Math.cos(oa) * radius * .18;
                var oy2 = Math.sin(oa) * radius * .18;
                ctx.beginPath(); ctx.arc(ox2, oy2, radius * (.18 + oc * .018), 0, Math.PI * 2);
                ctx.strokeStyle = hexToRgba(c[oc % 2], .76 * e); ctx.lineWidth = 1.1; ctx.stroke();
              }
              ctx.restore();
            } else if (style === 9) {
              // ZEBRA BEND — black-ish / saturated curved stripes.
              ctx.save(); ctx.translate(sx, sy); ctx.rotate(phase * .20);
              for (var z = -radius; z < radius; z += 8) {
                ctx.beginPath();
                for (var zx = -radius; zx <= radius; zx += 4) {
                  var zy = z + Math.sin(zx * .055 + phase * 3.05 + z * .035) * (12 + kineticPulse * 8);
                  if (zx === -radius) ctx.moveTo(zx, zy); else ctx.lineTo(zx, zy);
                }
                ctx.strokeStyle = hexToRgba(((z / 8) & 1) ? c[0] : c[3], .96 * e);
                ctx.lineWidth = 4.2; ctx.stroke();
              }
              ctx.restore();
            } else if (style === 10) {
              // HYPNOTIC TUNNEL — eccentric hard rings.
              ctx.save(); ctx.translate(sx, sy); ctx.rotate(phase * .22);
              for (var tr = 22; tr >= 0; tr--) {
                var tp = tr / 22;
                var off = Math.sin(phase * 1.18 + tr * .4) * radius * (.10 + kineticPulse * .07) * (1 - tp);
                ctx.beginPath(); ctx.arc(off, 0, radius * tp, 0, Math.PI * 2);
                ctx.fillStyle = hexToRgba(c[tr % 4], .94 * e); ctx.fill();
              }
              ctx.restore();
            } else {
              // PINWHEEL — alternating curved blades.
              ctx.save(); ctx.translate(sx, sy); ctx.rotate(-phase * (.62 + kineticPulse * .18));
              for (var blade = 0; blade < 30; blade++) {
                var ba = blade * Math.PI * 2 / 30;
                ctx.save(); ctx.rotate(ba);
                ctx.beginPath(); ctx.moveTo(0, 0);
                ctx.quadraticCurveTo(radius * .45, -radius * .16, radius * .98, 0);
                ctx.quadraticCurveTo(radius * .48, radius * .05, 0, 0);
                ctx.closePath();
                ctx.fillStyle = hexToRgba(c[blade % 4], .93 * e); ctx.fill();
                ctx.restore();
              }
              ctx.restore();
            }
    
            // Crisp boundary only; no glow/gradient rim.
            ctx.beginPath(); ctx.arc(sx, sy, radius * .94, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(11,11,10,' + (.22 * e).toFixed(3) + ')';
            ctx.lineWidth = 1; ctx.stroke();
    
            ctx.restore();
          }
    
          function updateAndDrawSyncPair(t, dt) {
            if (!syncEvent) return;
            var age = t - syncEvent.born;
    
            if (age < 0 || age > syncEvent.duration) {
              if (age > syncEvent.duration) {
                var pair = [syncEvent.a, syncEvent.b];
                for (var ii = 0; ii < pair.length; ii++) {
                  var n = pair[ii];
                  // Restore the ORIGINAL student-circle appearance.
                  n.syncRole = null;
                  n.syncVisual = 0;
                  n.returning = true;
                  n.returnX = n.x;
                  n.returnY = n.y;
                  n.returnVX = 0;
                  n.returnVY = 0;
                }
                syncEvent.teamA.syncEnergy = 0;
                syncEvent.teamB.syncEnergy = 0;
                syncEvent = null;
              }
              return;
            }
    
            var a = syncEvent.a, b = syncEvent.b;
    
            if (!syncEvent.locked) {
              syncEvent.locked = true;
              // B's location is the temporary SYNC location.
              syncEvent.cx = b.x;
              syncEvent.cy = b.y;
              syncEvent.startAngle = Math.atan2(a.y - b.y, a.x - b.x);
              if (!isFinite(syncEvent.startAngle)) syncEvent.startAngle = 0;
              syncEvent.pairRadius = Math.max(9, Math.min(13, (a.r + b.r) * 1.08));
              syncEvent.patternStarted = false;
            }
    
            // PHASE 1: students connect and revolve at B's position.
            var theta = syncEvent.startAngle + age * 5.2 * syncEvent.spin;
            var r = syncEvent.pairRadius, cx = syncEvent.cx, cy = syncEvent.cy;
            var ax = cx + Math.cos(theta) * r, ay = cy + Math.sin(theta) * r;
            var bx = cx + Math.cos(theta + Math.PI) * r, by = cy + Math.sin(theta + Math.PI) * r;
            var settle = Math.min(1, age / .18);
    
            if (draggingNode !== a) {
              a.x += (ax - a.x) * Math.min(1, dt * 20 * settle);
              a.y += (ay - a.y) * Math.min(1, dt * 20 * settle);
            }
            if (draggingNode !== b) {
              b.x += (bx - b.x) * Math.min(1, dt * 20 * settle);
              b.y += (by - b.y) * Math.min(1, dt * 20 * settle);
            }
    
            // BOTH student circles visibly react while they revolve around one another.
            // The effect remains strictly inside each existing student circle.
            var pairFadeIn = Math.min(1, age / .12);
            var pairFadeOut = Math.min(1, (syncEvent.duration - age) / .45);
            var pairVisual = Math.max(0, Math.min(pairFadeIn, pairFadeOut));
            a.syncVisual = pairVisual;
            b.syncVisual = pairVisual;
            a.syncRole = 'source';
            b.syncRole = 'target';
    
            // PHASE 2: ONLY AFTER the A/B connection + mutual rotation is clearly visible
            // may the two large team cores begin their pattern phenomena.
            var patternDelay = .82;
            if (age >= patternDelay && !syncEvent.patternStarted) {
              syncEvent.patternStarted = true;
              syncEvent.teamA.syncStart = t;
              syncEvent.teamB.syncStart = t;
              syncEvent.teamA.syncEnergy = 1;
              syncEvent.teamB.syncEnergy = 1;
            }
    
            if (syncEvent.patternStarted) {
              var patternAge = age - patternDelay;
              var remaining = syncEvent.duration - age;
              var pe = Math.min(1, patternAge / .16) * Math.min(1, remaining / .55);
              syncEvent.teamA.syncEnergy = Math.max(0, pe);
              syncEvent.teamB.syncEnergy = Math.max(0, pe);
            }
          }
    
          function drawSyncRoles(t) {
            if (!syncSourceNode) return;
            function ring(n, source, strength) {
              if (!n) return;
              var sx = n.x - camera.x, sy = n.y - camera.y, rr = Math.max(7, n.r * (n.scale || 1));
              ctx.save();
              if (source) {
                ctx.strokeStyle = 'rgba(255,52,143,' + (.88 * strength).toFixed(3) + ')';
                ctx.lineWidth = 2.3; ctx.beginPath(); ctx.arc(sx, sy, rr + 8 + Math.sin(t * 7) * 1.5, 0, Math.PI * 2); ctx.stroke();
              } else {
                ctx.strokeStyle = 'rgba(35,224,196,' + (.9 * strength).toFixed(3) + ')';
                ctx.lineWidth = 2.3; ctx.setLineDash([4, 4]); ctx.lineDashOffset = -t * 20;
                ctx.beginPath(); ctx.arc(sx, sy, rr + 9, 0, Math.PI * 2); ctx.stroke();
              }
              ctx.restore();
            }
            ring(syncSourceNode, true, 1);
            if (syncTargetNode) ring(syncTargetNode, false, Math.max(.28, syncTargetStrength));
          }
    
          function drawOrbits() {
            for (var i = 0; i < blobs.length; i++) {
              var team = blobs[i];
              var sx = team.currentX - camera.x;
              var sy = team.currentY - camera.y;
              if (sx < -team.outerRadius || sx > W + team.outerRadius ||
                sy < -team.outerRadius || sy > H + team.outerRadius) continue;
    
              ctx.save();
              ctx.strokeStyle = 'rgba(27,67,61,0.25)';
              ctx.lineWidth = 0.8;
              ctx.setLineDash([2.2, 5.2]);
              ctx.lineDashOffset = -team.phase * 5;
              for (var orbitIndex = 0; orbitIndex < 3; orbitIndex++) {
                var orbit = team.orbitRadii[orbitIndex];
                ctx.beginPath();
                ctx.ellipse(sx, sy, orbit.x, orbit.y, team.syncRotation || 0, 0, Math.PI * 2);
                ctx.stroke();
              }
              ctx.restore();
            }
          }
    
          function drawTeamCores(t) {
            for (var i = 0; i < blobs.length; i++) {
              var team = blobs[i];
              var sx = team.currentX - camera.x;
              var sy = team.currentY - camera.y;
              var radius = team.renderRadius;
              if (sx < -radius * 2 || sx > W + radius * 2 || sy < -radius * 2 || sy > H + radius * 2) continue;
    
              var gradient = ctx.createRadialGradient(
                sx - radius * 0.12, sy - radius * 0.14, radius * 0.05,
                sx, sy, radius
              );
              var hoverBoost = 1 + team.hoverAmount * 0.08;
              gradient.addColorStop(0, 'rgba(41,224,196,' + (0.43 * hoverBoost).toFixed(3) + ')');
              gradient.addColorStop(0.42, 'rgba(41,224,196,' + (0.25 * hoverBoost).toFixed(3) + ')');
              gradient.addColorStop(0.76, 'rgba(41,224,196,' + (0.11 * hoverBoost).toFixed(3) + ')');
              gradient.addColorStop(1, 'rgba(41,224,196,0)');
    
              ctx.save();
              var activePatternCore = syncEvent && syncEvent.patternStarted &&
                (syncEvent.teamA === team || syncEvent.teamB === team);
              ctx.globalAlpha = activePatternCore
                ? Math.max(0, 1 - (team.syncEnergy || 0) * 1.18)
                : 1;
              ctx.shadowColor = 'rgba(41,224,196,' + (0.12 * hoverBoost).toFixed(3) + ')';
              ctx.shadowBlur = 18;
              ctx.beginPath();
              ctx.arc(sx, sy, radius, 0, Math.PI * 2);
              ctx.fillStyle = gradient;
              ctx.fill();
              ctx.restore();
    
              drawTeamSyncMotion(team, sx, sy, radius, t);
            }
          }
    
          function getTeamMajorDistribution(teamId) {
            var counts = { planning: 0, design: 0, programming: 0 };
            for (var i = 0; i < nodes.length; i++) {
              if (nodes[i].team === teamId && counts.hasOwnProperty(nodes[i].major)) {
                counts[nodes[i].major]++;
              }
            }
            return '기획' + counts.planning + ' · 디자인' + counts.design + ' · 프로그래밍' + counts.programming;
          }
    
          function drawTeamInfo() {
            for (var i = 0; i < blobs.length; i++) {
              var team = blobs[i];
              if (team.hoverAmount < 0.002) continue;
    
              var sx = team.currentX - camera.x;
              var sy = team.currentY - camera.y;
              var radius = team.renderRadius;
              if (sx < -radius || sx > W + radius || sy < -radius || sy > H + radius) continue;
    
              var info = team.info || TEAM_INFO[team.id];
              var textY = sy + radius * 0.15;
    
              ctx.save();
              ctx.globalAlpha = team.hoverAmount;
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillStyle = 'rgba(11,11,10,0.62)';
              ctx.font = '600 16px "JetBrains Mono", ui-monospace, sans-serif';
              ctx.fillText(info.name, sx, textY - 18);
    
              ctx.fillStyle = 'rgba(11,11,10,0.62)';
              ctx.font = '400 13px "JetBrains Mono", ui-monospace, sans-serif';
              ctx.fillText(info.category, sx, textY + 4);
    
              ctx.fillStyle = 'rgba(11,11,10,0.62)';
              ctx.font = '400 12px "JetBrains Mono", ui-monospace, sans-serif';
              ctx.fillText(getTeamMajorDistribution(team.id), sx, textY + 25);
              ctx.restore();
            }
          }
    
          function updateStudentMotion(n, dt, t) {
            var motionFactor = reduceMotion ? 0.12 : 1;
            var team = blobs[n.team];
    
            if (syncEvent && (syncEvent.a === n || syncEvent.b === n) &&
              t >= syncEvent.born && t <= syncEvent.born + syncEvent.duration) {
              n.scale = 1.10 + Math.sin(t * 8 + n.idx) * 0.06;
              return;
            }
    
            // While one student is dragged, every student in that team moves with it.
            if (draggingNode && n.team === draggingNode.team) {
              if (n.freeDragX !== null) {
                n.x = n.freeDragX;
                n.y = n.freeDragY;
              }
              n.scale = (draggingNode === n) ? 1.10 : 1.02;
              return;
            }
    
            // Compute the moving home/orbit target first.
            n.orbitAngle += n.orbitSpeed * n.orbitDirection * dt * motionFactor;
            var angularOffset = Math.sin(t * n.driftSpeed + n.driftPhase) * n.angularDrift * motionFactor;
            var radialOffset = Math.sin(t * (n.driftSpeed * 0.73) + n.driftPhase * 1.7) * n.driftAmount * motionFactor;
            var radius = Math.max(n.minRadius, Math.min(n.maxRadius, n.homeRadius + radialOffset));
            var angle = n.orbitAngle + angularOffset;
            n.homeLocalX = Math.cos(n.orbitAngle) * n.homeRadius;
            n.homeLocalY = Math.sin(n.orbitAngle) * n.homeRadius;
            var driftX = Math.sin(t * 0.14 + n.driftPhase * 2.1) * n.driftAmount * 0.45 * motionFactor;
            var driftY = Math.cos(t * 0.12 + n.driftPhase * 1.3) * n.driftAmount * 0.40 * motionFactor;
            var targetX = team.currentX + Math.cos(angle) * radius + driftX;
            var targetY = team.currentY + Math.sin(angle) * radius + driftY;
    
            if (n.returning) {
              // Spring back to the student's original moving orbit after SYNC/release.
              var spring = 34;
              var damping = 8.4;
              var dx = targetX - n.returnX;
              var dy = targetY - n.returnY;
              n.returnVX += dx * spring * dt;
              n.returnVY += dy * spring * dt;
              var damp = Math.exp(-damping * dt);
              n.returnVX *= damp;
              n.returnVY *= damp;
              n.returnX += n.returnVX * dt;
              n.returnY += n.returnVY * dt;
              n.x = n.returnX;
              n.y = n.returnY;
    
              if (Math.hypot(dx, dy) < 2.2 && Math.hypot(n.returnVX, n.returnVY) < 8) {
                n.returning = false;
                n.x = targetX;
                n.y = targetY;
              }
            } else {
              n.x = targetX;
              n.y = targetY;
            }
    
            n.scale = 1 + Math.sin(t * 0.52 + n.idx * 0.81) * 0.035 * motionFactor;
          }
    
          function findCandidate(candidates, nodeIndex) {
            for (var i = 0; i < candidates.length; i++) {
              if (candidates[i].node.idx === nodeIndex) return candidates[i];
            }
            return null;
          }
    
          function selectStableCandidates(node, candidates, t) {
            if (!node.connectionSlots) {
              node.connectionSlots = [
                { target: null, changedAt: -999 },
                { target: null, changedAt: -999 }
              ];
            }
    
            var selected = [];
            var used = {};
            for (var slotIndex = 0; slotIndex < node.connectionSlots.length; slotIndex++) {
              var slot = node.connectionSlots[slotIndex];
              var incumbent = slot.target === null ? null : findCandidate(candidates, slot.target);
              if (incumbent && used[incumbent.node.idx]) incumbent = null;
    
              var challenger = null;
              for (var candidateIndex = 0; candidateIndex < candidates.length; candidateIndex++) {
                if (!used[candidates[candidateIndex].node.idx]) {
                  challenger = candidates[candidateIndex];
                  break;
                }
              }
    
              var chosen = incumbent || challenger;
              if (incumbent && challenger && challenger.node.idx !== incumbent.node.idx &&
                t - slot.changedAt > 3.0 && challenger.score < incumbent.score - 78) {
                chosen = challenger;
              }
    
              if (chosen) {
                if (slot.target !== chosen.node.idx) {
                  slot.target = chosen.node.idx;
                  slot.changedAt = t;
                }
                used[chosen.node.idx] = true;
                selected.push(chosen);
              } else {
                slot.target = null;
              }
            }
            return selected;
          }
    
          function activateConnection(a, candidate, t, maxDistance) {
            var b = candidate.node;
            var key = Math.min(a.idx, b.idx) + ':' + Math.max(a.idx, b.idx);
            var connection = connections.get(key);
            if (!connection) {
              var seed = a.idx * 0.61 + b.idx;
              connection = {
                a: a,
                b: b,
                alpha: 0,
                targetAlpha: 1,
                progress: 0,
                progressDuration: 0.55 + seeded(a.idx + b.idx + 1, 61) * 0.55,
                tension: 0,
                strength: 0,
                targetStrength: 0,
                controlX: (a.x + b.x) * 0.5,
                controlY: (a.y + b.y) * 0.5,
                velocityX: 0,
                velocityY: 0,
                curveSign: seeded(a.idx + b.idx + 1, 62) < 0.5 ? -1 : 1,
                seed: seed,
                lastSeen: t
              };
              connections.set(key, connection);
            } else if (connection.alpha < 0.04) {
              connection.progress = 0;
            }
    
            var proximity = 1 - Math.min(1, candidate.distance / maxDistance);
            connection.targetAlpha = 1;
            connection.targetStrength = 0.28 + proximity * 0.50;
            connection.lastSeen = t;
          }
    
          function updateAndDrawConnections(t, dt, maxDistance) {
            connections.forEach(function (connection, key) {
              var a = connection.a;
              var b = connection.b;
              var dx = b.x - a.x;
              var dy = b.y - a.y;
              var distance = Math.hypot(dx, dy) || 1;
              var isDragged = draggingNode === a || draggingNode === b;
              var normalizedTension = Math.max(0, Math.min(1, (distance - 150) / Math.max(1, maxDistance - 150)));
              if (isDragged) normalizedTension = Math.min(1, normalizedTension + 0.14);
              if (connection.targetAlpha === 0) normalizedTension = 0;
    
              var alphaSpeed = connection.targetAlpha > connection.alpha ? 6.0 : 2.1;
              connection.alpha += (connection.targetAlpha - connection.alpha) * Math.min(1, dt * alphaSpeed);
              connection.strength += (connection.targetStrength - connection.strength) * Math.min(1, dt * 5.0);
              var tensionSpeed = connection.targetAlpha > 0 ? 3.8 : 1.7;
              connection.tension += (normalizedTension - connection.tension) * Math.min(1, dt * tensionSpeed);
              if (connection.targetAlpha > 0 && connection.progress < 1) {
                connection.progress = Math.min(1, connection.progress + dt / connection.progressDuration);
              }
    
              var midpointX = (a.x + b.x) * 0.5;
              var midpointY = (a.y + b.y) * 0.5;
              var normalX = -dy / distance;
              var normalY = dx / distance;
              var releaseSlack = connection.targetAlpha === 0 ? 0.018 : 0;
              var curveRatio = 0.012 + (1 - connection.tension) * 0.050 + releaseSlack;
              var subtleMotion = 0.86 + Math.sin(t * 0.32 + connection.seed) * 0.14;
              var curveAmount = distance * curveRatio * subtleMotion * connection.curveSign;
              var desiredControlX = midpointX + normalX * curveAmount;
              var desiredControlY = midpointY + normalY * curveAmount;
    
              var spring = isDragged ? 30 : 42;
              var damping = isDragged ? 8.0 : 10.5;
              connection.velocityX += (desiredControlX - connection.controlX) * spring * dt;
              connection.velocityY += (desiredControlY - connection.controlY) * spring * dt;
              var dampingFactor = Math.exp(-damping * dt);
              connection.velocityX *= dampingFactor;
              connection.velocityY *= dampingFactor;
              connection.controlX += connection.velocityX * dt;
              connection.controlY += connection.velocityY * dt;
    
              var easedProgress = 1 - Math.pow(1 - connection.progress, 3);
              var ax = a.x - camera.x;
              var ay = a.y - camera.y;
              var endX = a.x + dx * easedProgress - camera.x;
              var endY = a.y + dy * easedProgress - camera.y;
              var controlX = a.x + (connection.controlX - a.x) * easedProgress - camera.x;
              var controlY = a.y + (connection.controlY - a.y) * easedProgress - camera.y;
              var finalAlpha = (0.18 + 0.20 * connection.tension) * connection.strength * connection.alpha;
    
              if (connection.alpha > 0.002 && easedProgress > 0.002) {
                ctx.save();
                ctx.lineWidth = 0.55 + 0.45 * connection.tension + (isDragged ? 0.06 : 0);
                ctx.lineCap = 'round';
                ctx.strokeStyle = 'rgba(23,74,67,' + Math.max(0, finalAlpha).toFixed(3) + ')';
                ctx.beginPath();
                ctx.moveTo(ax, ay);
                ctx.quadraticCurveTo(controlX, controlY, endX, endY);
                ctx.stroke();
                ctx.restore();
              }
    
              if (connection.targetAlpha === 0 && connection.alpha < 0.004) {
                connections.delete(key);
              }
            });
          }
    
          function drawEdges(t, dt) {
            var maxDistance = Math.max(680, Math.min(860, Math.min(W, H) * 0.86));
    
            connections.forEach(function (connection) {
              connection.targetAlpha = 0;
              connection.targetStrength = connection.strength;
            });
    
            for (var i = 0; i < nodes.length; i++) {
              var a = nodes[i];
              var ax = a.x - camera.x;
              var ay = a.y - camera.y;
              if (ax < -maxDistance || ax > W + maxDistance || ay < -maxDistance || ay > H + maxDistance) continue;
    
              var candidates = [];
              for (var j = 0; j < nodes.length; j++) {
                if (i === j) continue;
                var b = nodes[j];
                var distance = Math.hypot(b.x - a.x, b.y - a.y);
                if (distance > maxDistance) continue;
                var changingBias = Math.sin(t * 0.52 + i * 1.73 + j * 0.91) * 72;
                candidates.push({ node: b, distance: distance, score: distance + changingBias });
              }
              candidates.sort(function (left, right) { return left.score - right.score; });
    
              var selected = selectStableCandidates(a, candidates, t);
              var bridgePhase = Math.floor(t / 4) % 5;
              if (i % 5 === bridgePhase) {
                for (var bridgeIndex = 0; bridgeIndex < candidates.length; bridgeIndex++) {
                  if (candidates[bridgeIndex].node.team !== a.team) {
                    selected.push(candidates[bridgeIndex]);
                    break;
                  }
                }
              }
    
              for (var k = 0; k < selected.length; k++) {
                activateConnection(a, selected[k], t, maxDistance);
              }
            }
    
            updateAndDrawConnections(t, dt, maxDistance);
          }
    
          function drawPing(x, y, t) {
            var p = { x: x - camera.x, y: y - camera.y };
            if (p.x < -60 || p.x > W + 60 || p.y < -60 || p.y > H + 60) return;
            var cycle = 3.2;
            var local = (t + (x + y) * 0.004) % cycle;
            var progress = local / cycle;
            var r = 4 + progress * 34;
            var alpha = (1 - progress) * 0.55;
            ctx.beginPath();
            ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(41,224,196,' + Math.max(0, alpha).toFixed(3) + ')';
            ctx.lineWidth = 1.2;
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(p.x, p.y, 2.4, 0, Math.PI * 2);
            ctx.fillStyle = COLOR_ACCENT_STRONG;
            ctx.fill();
          }
    
          function drawNode(n, t) {
            var sx = n.x - camera.x;
            var sy = n.y - camera.y;
            var rr = Math.max(6, n.r * (n.scale || 1));
            var isDragging = (draggingNode === n);
            var isHovered = (hoveredNode === n);
            var isActiveTeam = (!!draggingNode && n.team === draggingNode.team) ||
              (!!draggingBlob && n.team === draggingBlob.team);
            var useMajorColor = isDragging || isHovered;
            if (sx < -rr - 30 || sx > W + rr + 30 || sy < -rr - 30 || sy > H + rr + 30) return;
    
            for (var i = n.pulses.length - 1; i >= 0; i--) {
              var p = n.pulses[i];
              p.t += 1;
              var pr = rr + p.t * 1.6;
              var alpha = Math.max(0, 1 - p.t / 40);
              if (alpha <= 0) { n.pulses.splice(i, 1); continue; }
              ctx.beginPath();
              ctx.arc(sx, sy, pr, 0, Math.PI * 2);
              ctx.strokeStyle = isHovered ? hexToRgba(MAJOR_COLORS[n.major], alpha * 0.72) :
                ((isDragging ? 'rgba(255,0,123,' : 'rgba(41,224,196,') + (alpha * 0.7).toFixed(3) + ')');
              ctx.lineWidth = 1.5;
              ctx.stroke();
            }
    
            if (isHovered) {
              ctx.beginPath();
              ctx.arc(sx, sy, rr + 6 + Math.sin(t * 8) * 3, 0, Math.PI * 2);
              ctx.strokeStyle = hexToRgba(MAJOR_COLORS[n.major], 0.78);
              ctx.lineWidth = 2.0;
              ctx.stroke();
            }
    
            ctx.save();
            if (isDragging) {
    
              ctx.shadowBlur = 12;
            } else if (isHovered) {
              ctx.shadowColor = MAJOR_COLORS[n.major];
              ctx.shadowBlur = 11;
            } else if (isActiveTeam) {
              ctx.shadowColor = 'rgba(41,224,196,0.26)';
              ctx.shadowBlur = 5;
            } else {
              ctx.shadowColor = 'rgba(11,11,10,0.08)';
              ctx.shadowBlur = 3;
            }
            ctx.shadowOffsetY = 1;
    
            var sv = n.syncVisual || 0;
            ctx.beginPath();
            ctx.arc(sx, sy, rr, 0, Math.PI * 2);
            if (sv > 0) {
              ctx.fillStyle = n.syncRole === 'source'
                ? 'rgba(255,0,110,0.98)'
                : 'rgba(0,220,255,0.98)';
            } else {
              ctx.fillStyle = useMajorColor ? MAJOR_COLORS[n.major] : 'rgba(255,255,255,0.88)';
            }
            ctx.fill();
    
            if (sv > 0) {
              // Interaction is contained inside the original student circle.
              ctx.save();
              ctx.beginPath(); ctx.arc(sx, sy, rr, 0, Math.PI * 2); ctx.clip();
              ctx.translate(sx, sy);
              var dir = n.syncRole === 'source' ? 1 : -1;
              ctx.rotate(t * 6.4 * dir + n.idx * .27);
    
              ctx.beginPath(); ctx.moveTo(0, 0);
              ctx.arc(0, 0, rr * 1.08, -Math.PI * .48, Math.PI * .48);
              ctx.closePath();
              ctx.fillStyle = n.syncRole === 'source'
                ? 'rgba(255,230,0,' + (0.88 * sv).toFixed(3) + ')'
                : 'rgba(91,44,255,' + (0.94 * sv).toFixed(3) + ')';
              ctx.fill();
    
              ctx.beginPath();
              ctx.arc(rr * .35, 0, Math.max(1.2, rr * .20), 0, Math.PI * 2);
              ctx.fillStyle = 'rgba(255,255,255,' + (0.92 * sv).toFixed(3) + ')';
              ctx.fill();
              ctx.restore();
            }
    
            ctx.strokeStyle = sv > 0
              ? (n.syncRole === 'source' ? 'rgba(255,0,110,0.98)' : 'rgba(0,180,155,0.98)')
              : (useMajorColor ? hexToRgba(MAJOR_COLORS[n.major], 0.92) :
                (isActiveTeam ? 'rgba(41,224,196,0.52)' : 'rgba(20,20,20,0.26)'));
            ctx.lineWidth = sv > 0 ? 1.5 : (useMajorColor ? 1.1 : 0.8);
            ctx.stroke();
            ctx.restore();
    
            var label = 'STUDENT ' + String(n.id).padStart(2, '0');
            var labelY = sy + rr + 11;
            var labelFontSize = 8;
            ctx.font = '500 ' + labelFontSize + 'px "JetBrains Mono", ui-monospace, monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            var labelWidth = ctx.measureText(label).width;
            var labelRect = null;
            for (var labelStep = 0; labelStep < 5; labelStep++) {
              var candidateY = labelY + labelStep * 11;
              var candidateRect = {
                left: sx - labelWidth / 2 - 5,
                right: sx + labelWidth / 2 + 5,
                top: candidateY - 6,
                bottom: candidateY + 6
              };
              var overlaps = labelBounds.some(function (bound) {
                return candidateRect.left < bound.right && candidateRect.right > bound.left &&
                  candidateRect.top < bound.bottom && candidateRect.bottom > bound.top;
              });
              if (!overlaps || labelStep === 4) {
                labelY = candidateY;
                labelRect = candidateRect;
                break;
              }
            }
            labelBounds.push(labelRect);
            ctx.fillStyle = 'rgba(255,255,255,0.76)';
            ctx.fillRect(sx - labelWidth / 2 - 3, labelY - 5.5, labelWidth + 6, 11);
            ctx.fillStyle = 'rgba(11,11,10,0.72)';
            ctx.fillText(label, sx, labelY + 0.5);
            ctx.textAlign = 'left';
          }
    
          function updateHover(dt) {
            hoveredNode = null;
            hoveredTeam = null;
    
            if (draggingBlob) {
              hoveredTeam = draggingBlob;
            } else if (mouse.active) {
              var best = 1e9;
              for (var i = 0; i < nodes.length; i++) {
                var n = nodes[i];
                var d = Math.hypot(mouse.worldX - n.x, mouse.worldY - n.y);
                if (d < n.r + 10 && d < best) {
                  best = d;
                  hoveredNode = n;
                }
              }
    
              if (!hoveredNode) {
                best = 1e9;
                for (var teamIndex = 0; teamIndex < blobs.length; teamIndex++) {
                  var team = blobs[teamIndex];
                  var teamDistance = Math.hypot(mouse.worldX - team.currentX, mouse.worldY - team.currentY);
                  if (teamDistance < team.renderRadius && teamDistance < best) {
                    best = teamDistance;
                    hoveredTeam = team;
                  }
                }
              }
            }
    
            var fadeStep = Math.min(1, dt * 10);
            for (var j = 0; j < blobs.length; j++) {
              var targetHover = blobs[j] === hoveredTeam ? 1 : 0;
              blobs[j].hoverAmount += (targetHover - blobs[j].hoverAmount) * fadeStep;
              if (blobs[j].hoverAmount < 0.001 && targetHover === 0) blobs[j].hoverAmount = 0;
            }
          }
    
          function frame(now) {
            if (disposed) return;
            if (!activeRef.current) {
              last = now;
              rafId = requestAnimationFrame(frame);
              return;
            }
            var t = (now - start) / 1000;
            var dt = Math.min(0.05, (now - last) / 1000);
            last = now;
    
            updateCamera();
            mouse.worldX = mouse.x + camera.x;
            mouse.worldY = mouse.y + camera.y;
    
            var i;
            for (i = 0; i < blobs.length; i++) updateTeamPosition(blobs[i], t, dt);
            separateBlobs();
            attractSyncTeams(t, dt);
            relaxSyncRotations(dt);
            syncDraggedObject();
            for (i = 0; i < nodes.length; i++) updateStudentMotion(nodes[i], dt, t);
            updateHover(dt);
            updateSyncInteraction(t, dt);
    
            ctx.clearRect(0, 0, W, H);
            drawSyncBackground(t);
            drawOrbits();
            drawEdges(t, dt);
            drawTeamCores(t);
            drawTeamInfo();
            labelBounds = [];
            for (i = 0; i < nodes.length; i++) drawNode(nodes[i], t);
            updateAndDrawSyncPair(t, dt);
    
    
            rafId = requestAnimationFrame(frame);
          }
    
          var resizeTimer = null;
          var handleResize = function () {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function () {
              resize();
              layout();
            }, 120);
          };
          window.addEventListener('resize', handleResize);
    
          resize();
          layout();
          rafId = requestAnimationFrame(frame);

    return () => {
      disposed = true;
      if (rafId) cancelAnimationFrame(rafId);
      if (resizeTimer) clearTimeout(resizeTimer);
      if (typeof handleResize !== 'undefined') window.removeEventListener('resize', handleResize);
      if (canvas && canvas.parentNode) {
        canvas.parentNode.replaceChild(canvas.cloneNode(false), canvas);
      }
    };
  }, []);

  return (
    <div ref={rootRef} className="circle-scene" aria-hidden={!active}>
      <div className="stage-wrap">
        <canvas id="scene" />
      </div>
      <div className="vignette" />
    </div>
  );
}
