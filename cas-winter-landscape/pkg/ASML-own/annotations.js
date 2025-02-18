function syncAnnotations(sourceDraw, targetDraw, event) {
    var features = event.features;
    var operation = event.type; // Get the type of operation: 'draw.create', 'draw.update', or 'draw.delete'
    features.forEach(function (feature) {
        if (operation === 'draw.delete') {
            // If it's a delete operation, remove the feature from the targetDraw
            targetDraw.delete(feature.id);
        } else {
            // Otherwise, add or update the feature in the targetDraw
            var existingFeature = targetDraw.get(feature.id);
            if (existingFeature) {
                targetDraw.delete(feature.id);
            }
            targetDraw.add(feature);
        }
    });
}

function syncFromMap1ToMap2(event) {
    syncAnnotations(draw, draw2, event);
}

function syncFromMap2ToMap1(event) {
    syncAnnotations(draw2, draw, event);
}

function syncFromMap1ToMap3(event) {
    syncAnnotations(draw, draw3, event);
}

function syncFromMap3ToMap1(event) {
    syncAnnotations(draw3, draw, event);
}

function syncFromMap2ToMap3(event) {
    syncAnnotations(draw2, draw3, event);
}

function syncFromMap3ToMap2(event) {
    syncAnnotations(draw3, draw2, event);
}

function syncFromMap1ToMap4(event) {
    syncAnnotations(draw, draw4, event);
}

function syncFromMap4ToMap1(event) {
    syncAnnotations(draw4, draw, event);
}

function syncFromMap2ToMap4(event) {
    syncAnnotations(draw2, draw4, event);
}

function syncFromMap4ToMap2(event) {
    syncAnnotations(draw4, draw2, event);
}

function syncFromMap3ToMap4(event) {
    syncAnnotations(draw3, draw4, event);
}

function syncFromMap4ToMap3(event) {
    syncAnnotations(draw4, draw3, event);
}

function toggleCommentSection(selectedId) {
    document.querySelectorAll('.comment-section').forEach(section => {
        if (section.id === `comment-section-${selectedId}`) {
            section.style.display = 'block';
        } else {
            section.style.display = 'none';
        }
    });
}

function selectFeature(featureId) {
    // Deselect the previously selected log entry and hide its details
    var currentSelected = document.querySelector('.log-entry.selected');
    if (currentSelected) {
        currentSelected.classList.remove('selected');
        var previousFeatureId = currentSelected.getAttribute('data-id');
        var previousFeatureDetails = document.getElementById(`feature-details-${previousFeatureId}`);
        if (previousFeatureDetails) {
            previousFeatureDetails.style.display = 'none';
        }
    }

    // Select the new log entry and display its details
    var logEntry = document.querySelector(`.log-entry[data-id="${featureId}"]`);
    if (logEntry) {
        logEntry.classList.add('selected');
        var currentFeatureDetails = document.getElementById(`feature-details-${featureId}`);
        if (currentFeatureDetails) {
            currentFeatureDetails.style.display = 'block';
        }
    }

    // Get the feature and its coordinates
    var feature = draw.get(featureId);
    if (feature && feature.geometry && feature.geometry.coordinates) {
        var coordinates = feature.geometry.coordinates;
        var center;

        if (feature.geometry.type === 'Point') {
            center = {
                lng: coordinates[0],
                lat: coordinates[1]
            };
        } else if (feature.geometry.type === 'LineString') {
            center = calculateCentroid_line(coordinates, 'LineString');
        } else if (feature.geometry.type === 'Polygon') {
            center = calculateCentroid_polygon(coordinates, 'Polygon');
        }

        if (center) {
            webgl.flyTo({
                center: center,
                zoom: 4,
                essential: true
            });
        } else if (feature.geometry.type === 'LineString' || feature.geometry.type === 'Polygon') {
            var bounds = coordinates.reduce(function (bounds, coord) {
                return bounds.extend(coord);
            }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));

            webgl.fitBounds(bounds, {
                padding: 20
            });
        } else {
            console.error('Invalid coordinates:', coordinates);
        }
    } else {
        console.error('Invalid feature or feature geometry:', feature);
    }

    // Toggle comment section
    toggleCommentSection(featureId);
}


function calculateCentroid_line(coordinates) {
    var totalPoints = coordinates.length;
    var x = 0, y = 0;
    coordinates.forEach(function(point) {
        x += point[0];
        y += point[1];
    });
    return {
        lng: x / totalPoints,
        lat: y / totalPoints
    };
}

function calculateCentroid_polygon(coordinates) {
    var totalPoints = coordinates[0].length; // Total number of points in the polygon
    var x = 0, y = 0;

    // Sum up all the coordinates
    coordinates[0].forEach(function(point) {
        x += point[0];
        y += point[1];
    });

    // Calculate the average
    var centerX = x / totalPoints;
    var centerY = y / totalPoints;

    return {
        lng: centerX,
        lat: centerY
    };
}

function filterAnnotations() {
    var filterDate = document.getElementById('filter-date').value;
    var filterUrgent = document.getElementById('filter-urgent').checked;

    var logEntries = document.querySelectorAll('#log-entries .log-entry');
    logEntries.forEach(function (logEntry) {
        var entryDate = logEntry.dataset.date;
        var entryUrgent = logEntry.dataset.urgent === 'true';

        var dateMatch = !filterDate || new Date(entryDate) >= new Date(filterDate);
        var urgentMatch = !filterUrgent || entryUrgent;

        if (dateMatch && urgentMatch) {
            logEntry.style.display = 'block';
        } else {
            logEntry.style.display = 'none';
        }
    });
}

function filterAutomatedCracks() {
    var filterVerified = document.getElementById('filter-verified').checked;
    var filterNotVerified = document.getElementById('filter-not-verified').checked;
    var logEntries = document.querySelectorAll('#automated-cracks-entries .log-entry');
    logEntries.forEach(function (entry) {
        var entryVerified = entry.dataset.verified === 'true';

        var hide = false;
        if (filterVerified && !entryVerified) {
            hide = true;
        }
        if (filterNotVerified && entryVerified) {
            hide = true;
        }

        entry.style.display = hide ? 'none' : '';
    });
}

function getCurrentDate() {
    var date = new Date();
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
}

currentUsername = 'Anonymous';
function updateUsername() {
    var usernameInput = document.getElementById('username-input');
    currentUsername = usernameInput.value || 'Anonymous';
}

function deleteAnnotation(featureId) {
    var feature = draw.get(featureId);
    if (feature) {
        // Get the similar components to be highlighted
        var similarComponents = feature.properties.similar;

        // Delete the feature itself
        draw.delete(featureId);
        draw2.delete(featureId);
        draw3.delete(featureId);
        draw4.delete(featureId);
        var logEntry = document.querySelector(`.log-entry[data-id="${featureId}"]`);
        if (logEntry) {
            logEntry.remove();
        }
        removeMarker(featureId)

        // Iterate over all features and highlight similar components in red
        var allFeatures = draw.getAll().features;
        allFeatures.forEach(function (f) {
            if (similarComponents.includes(f.properties.component)) {
                var logEntrySimilar = document.querySelector(`.log-entry[data-id="${f.id}"]`);
                if (logEntrySimilar) {
                    if (!f.properties.verified) {
                        logEntrySimilar.style.backgroundColor = 'rgb(255, 96, 96)';
                        addMarker(f.id, f.geometry.coordinates[0])
                    }
                }
            }
        });

        sortLogEntries(); // Call the sorting function
    }
}

function verifyAnnotation(featureId) {
    var feature = draw.get(featureId);
    if (feature) {
        var logEntry = document.querySelector(`.log-entry[data-id="${featureId}"]`);
        var verifiedCheck = document.getElementById(`verified-check-${featureId}`);
        var deleteButton = logEntry.querySelector('button[onclick^="deleteAnnotation"]');

        var similarComponents = feature.properties.similar;

        if (feature.properties.verified) {
            feature.properties.verified = false;
            draw.add(feature);
            draw2.add(feature);
            draw3.add(feature);
            draw4.add(feature);
            logEntry.classList.remove('verified');
            verifiedCheck.style.display = 'none';
            deleteButton.disabled = false;
        } else {
            feature.properties.verified = true;
            draw.add(feature);
            draw2.add(feature);
            draw3.add(feature);
            draw4.add(feature);
            removeMarker(featureId)
            logEntry.classList.add('verified');
            verifiedCheck.style.display = 'inline';
            logEntry.style.backgroundColor = ''; 
            verifiedCheck.style.display = 'inline';
            deleteButton.disabled = true;

            // Iterate over all features and highlight similar components in green
            var allFeatures = draw.getAll().features;
            allFeatures.forEach(function(f) {
                if (similarComponents.includes(f.properties.component)) {
                    var logEntrySimilar = document.querySelector(`.log-entry[data-id="${f.id}"]`);
                    if (logEntrySimilar) {
                        if (!f.properties.verified) {
                            logEntrySimilar.style.backgroundColor = 'rgb(140,236,133)';
                            addMarker(f.id, f.geometry.coordinates[0])
                            //addMarker(f.id, [0,0]) //TODO make this work, now it only shows one marker
                        }
                    }
                }
            });
        }
        logEntry.dataset.verified = feature.properties.verified;

        sortLogEntries(); // Call the sorting function
    }
}

function sortLogEntries() {
    var logEntriesContainer = document.getElementById('automated-cracks-entries');
    var logEntries = Array.from(logEntriesContainer.getElementsByClassName('log-entry'));

    logEntries.sort((a, b) => {
        var colorA = window.getComputedStyle(a).backgroundColor;
        var colorB = window.getComputedStyle(b).backgroundColor;
        if (colorA === 'rgb(140, 236, 133)') return -1; // Green to top
        if (colorB === 'rgb(140, 236, 133)') return 1;
        
        if (colorA === 'rgb(255, 96, 96)') return -1; // Red to top
        if (colorB === 'rgb(255, 96, 96)') return 1;

        return 0;
    });

    logEntries.forEach(entry => logEntriesContainer.appendChild(entry));
}

function logAnnotation(action, feature) {
    var logEntries = document.getElementById('log-entries');
    var automatedCracksEntries = document.getElementById('automated-cracks-entries');

    var logEntry = document.createElement('div');
    logEntry.className = 'log-entry';
    logEntry.dataset.id = feature.id; // Store feature ID
    logEntry.dataset.username = feature.properties.username;
    logEntry.dataset.date = feature.properties.creationDate || new Date().toISOString().split('T')[0]; // Store date in YYYY-MM-DD format
    logEntry.dataset.urgent = false;

    

    if (feature.properties.title === 'auto detected') {
        var title = "Auto detected " + feature.properties.component;
        logEntry.innerHTML = `
            <div class="title-section">
                <input type="text" id="title-input-${feature.id}" class="title-input" value="${title}" onclick="selectFeature('${feature.id}')" onchange="changeTitle('${feature.id}', this.value)">
                <span class="comment-indicator" id="comment-indicator-${feature.id}" style="display: none;"></span>
            </div>
            <div class="comment-section" id="comment-section-${feature.id}">
                <input type="text" id="comment-input-${feature.id}" class="comment-input" placeholder="Add a comment">
                <button class="comment-button" onclick="addComment('${feature.id}')">Comment</button>
                <button onclick="deleteAnnotation('${feature.id}')">❌</button>
                <button onclick="verifyAnnotation('${feature.id}')">✔</button>
                <span id="verified-check-${feature.id}" class="verified-check" style="display:none;">✔</span>
                <div id="comments-${feature.id}"></div>
            </div>
                
        `;
        automatedCracksEntries.appendChild(logEntry);
    } else {
        var title = feature.properties.title ? feature.properties.title : 'undefined';
        logEntry.innerHTML = `
        <div class="title-section">
            <input type="text" id="title-input-${feature.id}" class="title-input" value="${title}" onclick="selectFeature('${feature.id}')" onchange="changeTitle('${feature.id}', this.value)">
            <span class="comment-indicator" id="comment-indicator-${feature.id}" style="display: none;"></span>
        </div>
        <div class="feature-details" id="feature-details-${feature.id}" style="display:none;">
            <div>Type: ${feature.geometry.type}</div>
            <div>Created on: ${logEntry.dataset.date}</div>
            <div>
                <input type="checkbox" id="urgent-${feature.id}" name="urgent-${feature.id}" onchange="updateAnnotationStatus('${feature.id}', 'urgent', this.checked)">
                <label for="urgent-${feature.id}">Urgent</label><br>
            </div>
        </div>
        <div class="comment-section" id="comment-section-${feature.id}">
            <input type="text" id="comment-input-${feature.id}" class="comment-input" placeholder="Add a comment">
            <button class="comment-button" onclick="addComment('${feature.id}')">Comment</button>
            <div id="comments-${feature.id}"></div>
        </div>
    `;
        logEntries.prepend(logEntry);
    }
}

function changeTitle(featureId, newTitle) {
    var feature = draw.get(featureId);
    if (feature) {
        // Store the new title in the feature's properties
        feature.properties.title = newTitle;
        draw.add(feature);

        // Update the log entry
        var logEntry = document.querySelector(`.log-entry[data-id="${featureId}"]`);
        if (logEntry) {
            logEntry.querySelector('.title-input').value = newTitle;
        }
    }
}

function updateAnnotationStatus(featureId, statusType, statusValue) {
    var logEntry = document.querySelector(`.log-entry input#title-input-${featureId}`).closest('.log-entry');
    logEntry.dataset[statusType] = statusValue;
    filterAnnotations();
}

function deleteComment(commentElement) {
    var featureId = commentElement.parentElement.id.replace('comments-', '');
    commentElement.remove();

    var commentSection = document.getElementById(`comments-${featureId}`);
    var commentIndicator = document.getElementById(`comment-indicator-${featureId}`);

    // Check if there are any remaining comments
    if (commentSection.children.length === 0) {
        if (commentIndicator) {
            commentIndicator.style.display = 'none';
        }
    }
}  

function deleteReply(replyElement) {
    replyElement.remove();
}

function addComment(featureId, parentId = null) {
    var commentInput = document.getElementById(`comment-input-${featureId}`);
    if (!commentInput) {
        console.error('Comment input not found for feature ID:', featureId);
        return;
    }

    var commentText = commentInput.value.trim();
    if (commentText) {
        var commentsDiv = document.getElementById(`comments-${featureId}`);
        var comment = document.createElement('div');
        comment.className = parentId ? 'comment reply' : 'comment';
        comment.innerHTML = `
            <strong> ${currentUsername || 'Anonymous'}: </strong> <span>${commentText}</span>
            <div class="comment-date">${getCurrentDate()}</div>
            <input type="text" class="comment-input reply-input" placeholder="Reply">
            <button class="comment-button reply-button" onclick="addReply('${featureId}', this)">Reply</button>
            <button class="comment-delete" onclick="deleteComment(this.parentElement)">Delete</button>
        `;

        if (parentId) {
            var parentComment = document.getElementById(parentId);
            parentComment.appendChild(comment);
        } else {
            commentsDiv.appendChild(comment);
        }

        commentInput.value = '';

        // Show the comment indicator next to the title
        var commentIndicator = document.getElementById(`comment-indicator-${featureId}`);
        if (commentIndicator) {
            commentIndicator.style.display = 'inline-block';
        }

        // Optionally, you can add logic here to update the log entry class for styling purposes
        var logEntry = document.querySelector(`.log-entry[data-id="${featureId}"]`);
        if (logEntry) {
            logEntry.classList.add('has-comment');
        }
    }
}

function addReply(featureId, replyButton) {
    var replyInput = replyButton.previousElementSibling;
    var replyText = replyInput.value.trim();

    if (replyText) {
        var reply = document.createElement('div');
        reply.className = 'comment reply';
        reply.innerHTML = `
            <strong> ${currentUsername || 'Anonymous'}: </strong> <span>${replyText}</span>
            <div class="comment-date">${getCurrentDate()}</div>
            <button class="reply-delete" onclick="deleteReply(this.parentElement)">Delete</button>
        `;

        replyButton.parentElement.appendChild(reply);
        replyInput.value = '';
    }
}

function set_logAnnotation(map) {
    map.on('draw.create', function(e) {
        var feature = e.features[0];
        var creationDateTime = new Date().toISOString(); // Get current datetime in ISO format
        feature.properties.creationDateTime = creationDateTime; // Add creation datetime to feature properties
        feature.properties.creationDate = creationDateTime.split('T')[0]; // Extract date part and add it to feature properties
        feature.properties.username = currentUsername; // Set the username property
        logAnnotation('Created', feature);
    });

    var setDrawFeature = function(e) {
        if (e.action === 'draw.create' && e.features.length && e.features[0].type === 'Feature') {
            var feature = e.features[0];
            feature.properties.creationDate = new Date().toISOString().split('T')[0];
            feature.properties.username = currentUsername; // Set the username property
            logAnnotation('Created', feature);
        }
    };

    map.on('draw.update', setDrawFeature);
    map.on('draw.delete', function(e) {
        e.features.forEach(function(feature) {
            // Find the corresponding log entry
            var logEntry = document.querySelector(`.log-entry input#title-input-${feature.id}`).closest('.log-entry');
            // Remove the log entry if it exists
            if (logEntry) {
                logEntry.remove();
            }
        });
    });
    map.on('draw.selectionchange', setDrawFeature);
    map.on('click', function(e) {
        if (!newDrawFeature) {
            var drawFeatureAtPoint = draw.getFeatureIdsAt(e.point);

            //if another drawFeature is not found - reset drawFeatureID
            drawFeatureID = drawFeatureAtPoint.length ? drawFeatureAtPoint[0] : '';
        }

        newDrawFeature = false;
    })
}

function exportAnnotations() {
    var annotations = [];
    var logEntries = document.querySelectorAll('.log-entry');

    logEntries.forEach(function (logEntry) {
        var featureId = logEntry.dataset.id;
        var feature = draw.get(featureId);

        if (feature) {
            var comments = [];
            logEntry.querySelectorAll('.comment, .reply').forEach(function (commentElement) {
                comments.push({
                    text: commentElement.querySelector('span').innerText,
                    date: commentElement.querySelector('.comment-date').innerText,
                    username: commentElement.querySelector('strong').innerText.split(':')[0], // Extract username
                    parentId: commentElement.classList.contains('reply') ? commentElement.closest('.comment').querySelector('div').innerText : null
                });
            });

            annotations.push({
                feature: feature,
                title: feature.properties.title || 'undefined', // Include title
                creationDate: feature.properties.creationDate, // Include creation date here
                urgent: logEntry.dataset.urgent === 'true',
                comments: comments,
                color: feature.properties.portColor, // Include color
                username: logEntry.dataset.username || 'Anonymous' // Include username
            });
        }
    });

    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(annotations));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "annotations.json");
    document.body.appendChild(downloadAnchorNode); 
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}


function importAnnotations(event) {
    var file = event.target.files[0];
    var reader = new FileReader();
    reader.onload = function(e) {
        var annotations = JSON.parse(e.target.result);
        annotations.forEach(function (annotation) {
            // Add the feature to the map
            draw.add(annotation.feature);
            draw2.add(annotation.feature);
            draw3.add(annotation.feature);
            draw3.add(annotation.feature);

            // Restore the title, if present
            annotation.feature.properties.title = annotation.title;

            // Restore the color, if present
            if (annotation.color) {
                changeColor(annotation.color);
                draw.setFeatureProperty(annotation.feature.id, 'portColor', annotation.color);
            }
            
            annotation.feature.properties.username = annotation.username;
            logAnnotation('Imported', annotation.feature);

            var logEntry = document.querySelector(`.log-entry[data-id="${annotation.feature.id}"]`);

            // Restore the urgent status
            document.getElementById(`urgent-${annotation.feature.id}`).checked = annotation.urgent;
            logEntry.dataset.urgent = annotation.urgent;

            // Update the log entry to show the username
            let usernameElement = logEntry.querySelector('strong');
            if(usernameElement) {usernameElement.innerText = annotation.username || 'Anonymous'};

            // Restore the comments and replies
            var commentsDiv = document.getElementById(`comments-${annotation.feature.id}`);
            annotation.comments.forEach(function (comment) {
                var commentElement = document.createElement('div'); 
                commentElement.className = comment.parentId ? 'comment reply' : 'comment';
                commentElement.innerHTML = `
                    <strong>${comment.username || 'Anonymous'}:</strong> <span>${comment.text}</span>
                    <div class="comment-date">${comment.date}</div>
                    <input type="text" class="comment-input reply-input" placeholder="Reply">
                    <button class="comment-button reply-button" onclick="addReply('${annotation.feature.id}', this)">Reply</button>
                    <button class="comment-delete" onclick="deleteComment(this.parentElement)">Delete</button>
                `;

                if (comment.parentId) {
                    var parentComment = findParentComment(commentsDiv, comment.parentId);
                    if (parentComment) {
                        parentComment.appendChild(commentElement);
                    } else {
                        commentsDiv.appendChild(commentElement);
                    }
                } else {
                    commentsDiv.appendChild(commentElement);
                }
            });

            function findParentComment(container, parentId) {
                var commentElements = container.querySelectorAll('.comment');
                for (var i = 0; i < commentElements.length; i++) {
                    if (commentElements[i].querySelector('div').innerText === parentId) {
                        return commentElements[i];
                    }
                }
                return null;
            }
        });
    };
    reader.readAsText(file);
}

function selectLogEntry(featureId) {
    var logEntry = document.querySelector(`.log-entry[data-id="${featureId}"]`);
    if (logEntry) {
        // Remove the 'selected' class from all log entries
        var allLogEntries = document.querySelectorAll('.log-entry');
        allLogEntries.forEach(function(entry) {
            entry.classList.remove('selected');
        });
        // Add the 'selected' class to the selected log entry
        logEntry.classList.add('selected');
    }
}

function searchAnnotations() {
    var searchInput = document.getElementById('search-input').value.toLowerCase();
    var logEntries = document.querySelectorAll('.log-entry');
    logEntries.forEach(function(logEntry) {
        var titleInput = logEntry.querySelector('.title-input');
        if (titleInput){
            var title = titleInput.value.toLowerCase();

            if (title.includes(searchInput)) {
                logEntry.style.display = 'block';
            } else {
                logEntry.style.display = 'none';
            }
        }
    });
}