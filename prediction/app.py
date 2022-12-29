import numpy as np
from flask import *
from flask_cors import CORS
import os
import recommend
import glob

app = Flask(__name__)
CORS(app)


@app.route('/<int:userID>')
def get(userID):
    modelList = glob.glob('model/*')
    latestFolder = max(modelList, key=os.path.getctime)
    Ratings = np.load(latestFolder + '/ratings.npy')
    row_factor = np.load(latestFolder + '/row.npy')
    user_map = np.load(latestFolder + '/user.npy')
    item_map = np.load(latestFolder + '/item.npy')
    col_factor = np.load(latestFolder + '/col.npy')
    user_idx = 10
    found = False
    for i, userid in enumerate(user_map):
        if userID == userID:
            user_idx = i + 1
            found = True
            break
    if not found:
        recommend.do()

    user_rated = [i[1] for i in Ratings if i[0] == user_idx]

    assert (row_factor.shape[0] - len(user_rated)) >= 5
    user_f = row_factor[user_idx]
    pred_ratings = col_factor.dot(user_f)
    k_r = 5 + len(user_rated)
    candidate_items = np.argsort(pred_ratings)[-k_r:]
    recommended_items = [i for i in candidate_items if i not in user_rated]
    recommended_items = recommended_items[-5:]
    recommended_items.reverse()
    a = user_map[recommended_items]
    recommendations = [int(i) for i, item in enumerate(a)]
    return jsonify({"recommendations" : recommendations})


if __name__ == '__main__':
    app.run(debug=True)
