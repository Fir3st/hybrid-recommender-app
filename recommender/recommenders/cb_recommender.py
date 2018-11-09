class CBRecommender():
    @staticmethod
    def get_recommendations(movie_id):
        recommendations = {
            'movieId': movie_id,
            'recommendations': [
                {'id': 1, 'score': 0.987}
            ]
        }
        return recommendations
